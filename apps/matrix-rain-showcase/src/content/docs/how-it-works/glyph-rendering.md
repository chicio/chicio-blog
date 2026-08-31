---
title: Glyph rendering
sidebar:
  order: 3
---

**Source:** [`src/gpu/pipelines/render-glyphs.ts`](https://github.com/chicio/matrix-rain-webgpu/blob/main/src/gpu/pipelines/render-glyphs.ts), [`src/gpu/material/hash.ts`](https://github.com/chicio/matrix-rain-webgpu/blob/main/src/gpu/material/hash.ts)

The glyph pass is a single full-screen fragment shader. There's no per-glyph geometry — every pixel figures out which cell it belongs to, which glyph that cell shows, and how bright it is. This is the heart of the effect.

## From pixel to cell

Given the fragment's UV and the canvas `resolution`, the shader recovers a pixel position and maps it onto the glyph grid (cell size in device px):

$$
\text{col} = \left\lfloor \frac{p_x}{\text{cellSize}} \right\rfloor, \qquad
\text{row} = \left\lfloor \frac{p_y}{\text{cellSize}} \right\rfloor, \qquad
\text{localUv} = \operatorname{fract}\!\left(\frac{p}{\text{cellSize}}\right)
$$

`localUv` ∈ [0,1)² is the position **within** the cell — the UV used to sample that glyph. The column index looks up its `Column` record.

## Which cells are lit

A column's head is at `headY` (in cells). For the current row, let

$$ k = \lfloor \text{headY} \rfloor - \text{row} $$

be the distance behind the head. The cell is part of the trail when $0 \le k \le \text{tailLength}$; everything else is background. `k = 0` is the head itself.

## Which glyph

The glyph layer is a pure hash of the column seed and the **absolute row**:

```ts
const layer = glyphIndex(column.seed, row);
```

Because it depends on `row` (not on `k`), a cell's character is fixed in space. As the head falls, `k` changes but `row` doesn't — so the head appears to slide **past** stationary glyphs rather than dragging them along. Glyphs only change when the column respawns and rerolls its `seed`.

## Anti-aliased coverage (SDF + `fwidth`)

The atlas stores each glyph as a [signed distance field](/matrix-rain-webgpu/how-it-works/sdf-atlas/): the sampled value crosses `0.5` exactly at the glyph edge. Naively thresholding at `0.5` gives jagged edges. Instead we compute a smooth coverage with a band whose width tracks one screen pixel, using the screen-space derivative `fwidth`:

$$
\text{band} = \tfrac{1}{2}\,\operatorname{fwidth}(\text{localUv}_x)\cdot \text{softness}
$$
$$
\text{coverage} = \operatorname{smoothstep}(0.5 - \text{band},\; 0.5 + \text{band},\; s)
$$

where $s$ is the sampled SDF value. `fwidth` ≈ how much `localUv` changes between adjacent pixels, so the band is ~1px wide **regardless of font size** — that's the whole reason SDF text rendering exists: bake once, stay crisp at any scale.

`softness` widens the band for far columns to fake depth-of-field:

$$ \text{softness} = \operatorname{mix}(2.5,\; 1,\; \text{depth}) $$

Near columns (`depth → 1`) get a 1px band (crisp); far columns (`depth → 0`) get a 2.5× band (blurred).

## Brightness

Three factors multiply into the final brightness:

$$
\text{falloff} = \big(\operatorname{clamp}(1 - \tfrac{k}{\text{tailLength}},\,0,\,1)\big)^{1.5}
$$
$$
\text{depthDimming} = \operatorname{mix}(1 - \text{depthDim},\; 1,\; \text{depth})
$$

plus a per-cell **±20%** jitter (`brightnessJitter(seed, row)`, decorrelated from the glyph hash) for an organic, non-uniform trail — suppressed at the head so heads stay uniformly bright:

$$
\text{brightness} = \operatorname{clamp}\big(\text{falloff}\cdot\text{depthDimming}\cdot(1+\text{jitter}),\,0,\,1\big)
$$

The exponent `1.5` (steeper than linear) keeps the head bright for longer before the trail drops off.

## Color

The head is the bright `head` color; trail cells interpolate `trail → fade` by tail progress, then scale by brightness, then blend over the background by coverage:

$$
\text{trailColor} = \operatorname{mix}(\text{trail},\,\text{fade},\, \tfrac{k}{\text{tailLength}})
$$
$$
\text{rgb} = \operatorname{mix}\big(\text{background},\; \text{baseColor}\cdot\text{brightness},\; \text{coverage}\big)
$$

with `baseColor = head` when `k = 0`, else `trailColor`. Cells outside the trail short-circuit to the background color.

## Head emission (HDR)

`brightness` is clamped to `[0,1]`, but the final glyph color is **not** — it's multiplied by an emission factor that lets the head exceed `1.0`:

$$
\text{emission} = \operatorname{mix}(1,\; \text{headEmission},\; \text{falloff}), \qquad
\text{glyphColor} = \text{baseColor}\cdot\text{brightness}\cdot\text{emission}
$$

`headEmission` comes from `bloom.emission` (default `2`), tapering down the tail via `falloff`, so the head burns brightest. The display still clamps (the CRT tone-map), so on screen the head just reads white-hot — but the **HDR target keeps the >1.0 value**, which is exactly the headroom [bloom](/matrix-rain-webgpu/how-it-works/bloom/) extracts from. With emission, the rendered `rgb` above can exceed 1.0 at the head.

## Why it renders to HDR

This pass writes into an `rgba16float` target, not the swap chain, so the >1.0 head emission survives for the [bloom](/matrix-rain-webgpu/how-it-works/bloom/) extract and the final tone-map have real range to work with. See the [Pipeline overview](/matrix-rain-webgpu/architecture/pipeline-overview/).
