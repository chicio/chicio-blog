---
title: CRT post-process
sidebar:
  order: 6
---

**Source:** [`src/gpu/pipelines/crt.ts`](https://github.com/chicio/matrix-rain-webgpu/blob/main/src/gpu/pipelines/crt.ts)

The final full-screen pass stamps a CRT character onto the composited scene before it reaches the swap chain: **chromatic aberration → tone-map → scanlines**. When `crt={false}`, this is swapped for a plain passthrough blit.

## 1. Chromatic aberration

Real CRTs (and cheap lenses) don't focus all wavelengths to the same point. We fake it by sampling the red and blue channels with a small horizontal offset while green stays centered:

$$
\text{offset} = \frac{\text{aberration}}{\text{resolution}_x}, \quad
r = \text{tex}(uv + \text{offset})_r,\;
g = \text{tex}(uv)_g,\;
b = \text{tex}(uv - \text{offset})_b
$$

`aberration` is in **pixels** (default `1.0`), converted to uv space by dividing by width. At `0` there's no fringing.

## 2. Tone-map — clamp, not Reinhard

The composite is HDR (bloom can push values past 1.0). Mapping it to the displayable 0..1 range is tone-mapping. A common operator is Reinhard, $x/(x+1)$ — but that's for *true* HDR (values ≫ 1). Our signal is mostly in [0,1] (heads clamp at 1.0; bloom adds a modest overshoot), so Reinhard would crush midtones — a 1.0 head would map to 0.5, darkening everything. Instead we **clamp**:

$$ \text{color} = \operatorname{saturate}(r, g, b) = \operatorname{clamp}(\cdot,\,0,\,1) $$

Clamping lets bloom's >1.0 highlights blow out to white — the desirable glow — and is identical to the implicit clamp the swap chain would apply anyway. (If heads ever emit genuine HDR, revisit with a real operator.)

## 3. Scanlines

A horizontal brightness ripple — a sine in screen-space $y$:

$$ \text{scan} = 1 - \text{scanlineStrength}\cdot\big(0.5 + 0.5\sin(uv_y \cdot f)\big) $$

The frequency $f$ is tied to the canvas height so band **spacing stays constant in device pixels** at any size:

$$ f = \text{resolution}_y \cdot \frac{2\pi}{\text{SCANLINE\_PERIOD\_PX}}, \qquad \text{SCANLINE\_PERIOD\_PX} = 4 $$

i.e. one full bright→bright period every 4 device pixels. `scanlineStrength` (default `0.3`) controls only the **depth** of the ripple, not its spacing — multiply the color by `scan`.

## Why it's the last pass

It reads the fully-composited scene (reusing the single-texture blit binding) and writes the **swap chain** directly — so it's where HDR finally becomes the 8-bit image you see. Everything upstream stayed in HDR offscreen targets precisely so this step has real range to clamp and glow from. See the [Pipeline overview](/matrix-rain-webgpu/architecture/pipeline-overview/).
