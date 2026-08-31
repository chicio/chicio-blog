---
title: Bloom
sidebar:
  order: 5
---

**Source:** [`src/gpu/pipelines/bloom.ts`](https://github.com/chicio/matrix-rain-webgpu/blob/main/src/gpu/pipelines/bloom.ts)

Bloom is the glow around bright heads. It's the classic three-step image-space effect: **extract** bright pixels, **blur** them, **add** them back. It runs at half resolution (cheap) into HDR targets, only when `bloom` is enabled.

## 1. Bright-pass extract

Keep only what's brighter than the threshold, per channel, with a hard knee:

$$ \text{bright} = \max(\text{src} - \text{threshold},\; 0) $$

Dim pixels go to black; bright pixels survive minus the threshold. Subtracting (rather than just masking) makes the transition into the glow smooth. `threshold` is the `bloom.threshold` knob (default `0.8`). This is drawn into a **half-resolution** target — bloom is low-frequency, so half-res is invisible in the result and a 4× pixel saving.

## 2. Separable Gaussian blur

A true 2D Gaussian blur of radius $r$ costs $(2r+1)^2$ texture samples per pixel. But a Gaussian is **separable** — a 2D blur equals a horizontal 1D blur followed by a vertical one:

$$ G_{2D}(x,y) = G_{1D}(x)\,G_{1D}(y) $$

so the cost drops to $2(2r+1)$ samples. This effect does exactly that: a horizontal blur pass, then a vertical one (`direction = [1,0]` then `[0,1]`), each a 9-tap kernel (radius 4).

The weights are a sampled Gaussian, normalized so the symmetric kernel sums to 1:

$$ w_i = \frac{e^{-i^2 / 2\sigma^2}}{w_0 + 2\sum_{j=1}^{r} w_j}, \qquad \sigma = 1.8 $$

and the blurred value is the weighted sum of the center and the four taps each side:

$$ \text{out} = w_0 c + \sum_{i=1}^{4} w_i\,(c_{+i} + c_{-i}) $$

Taps step one **texel** at a time (`2 / resolution` in the half-res target's uv space), along the pass direction.

## 3. Combine

The blurred bloom is added back over the full-resolution scene, scaled by intensity:

$$ \text{out} = \text{scene} + \text{intensity}\cdot\text{bloom} $$

`intensity` is `bloom.intensity` (default `1.5`). The result goes into an HDR combine target — values can exceed 1.0 here, which is what lets the [CRT](/matrix-rain-webgpu/how-it-works/crt/) tone-map step blow highlights out to white.

## Head emission — giving bloom something to extract

There's a catch the threshold and intensity can't fix on their own: if nothing in the scene exceeds `1.0`, there's barely anything *above the threshold* to extract, and on the bright pixels themselves `scene + intensity·bloom` just clamps back to `1.0` (no visible change). Cranking intensity multiplies a near-empty signal; lowering the threshold just blooms the whole scene uniformly. Either way the glow stays weak.

The fix is **head emission**: the [glyph pass](/matrix-rain-webgpu/how-it-works/glyph-rendering/) multiplies the head by `bloom.emission` (default `2`) so it writes **above 1.0** into the HDR target — burning the head hotter than the display can show. Now the extract has real headroom (`emission − threshold` instead of `1 − threshold`), so blooming the heads produces a strong halo, and `threshold`/`intensity` actually bite.

A side effect: pushing all channels past `1.0` means the head **core clamps toward white** while the green survives in the surrounding glow (the green channel dominates after the blur) — the classic white-hot head + green halo. Lower `emission` toward `1` to keep greener cores; `emission = 1` disables it (heads stay in `[0,1]`). Emission only applies while bloom is enabled.

## Why HDR + half-res

- **HDR** (`rgba16float`) throughout so the extracted highlights and the `scene + intensity·bloom` sum aren't clipped before the final tone-map.
- **Half-res** for extract + blur because the glow is smooth; you can't see the resolution drop, and it quarters the work.

When `bloom={false}`, the whole extract → blur → blur → combine chain is skipped and the scene goes straight to the final pass — a real GPU saving, which is why it's a boolean gate rather than `intensity: 0`.
