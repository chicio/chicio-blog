---
title: SDF glyph atlas
sidebar:
  order: 2
---

**Source:** [`src/gpu/atlas/build-sdf-atlas.ts`](https://github.com/chicio/matrix-rain-webgpu/blob/main/src/gpu/atlas/build-sdf-atlas.ts), [`src/gpu/atlas/glyph-set.ts`](https://github.com/chicio/matrix-rain-webgpu/blob/main/src/gpu/atlas/glyph-set.ts)

Text on the GPU is hard to do crisply at arbitrary scale. The trick this effect uses — and the reason the glyphs stay sharp at any `fontSize` — is **signed distance fields** (SDF), baked once on the CPU at startup into a texture array.

## What is a signed distance field?

Instead of storing a glyph as black/white pixels, an SDF stores, at each texel, the **signed distance to the nearest glyph edge**:

$$
\text{SDF}(p) = \begin{cases} +\,\lVert p - e \rVert & p \text{ inside the glyph} \\ -\,\lVert p - e \rVert & p \text{ outside} \end{cases}
$$

where $e$ is the closest edge point. The edge itself is the zero crossing. Because distance is smooth and (bilinearly) interpolatable, the shader can reconstruct a crisp edge at any magnification — see the `smoothstep`/`fwidth` step in [Glyph rendering](/matrix-rain-webgpu/how-it-works/glyph-rendering/).

## Baking, glyph by glyph

For each of the ~48 glyphs (kana, digits, punctuation), at a layer size of 64²:

1. **Rasterize** the character to an offscreen 2D canvas (`OffscreenCanvas`, white text, `FONT_SCALE = 0.75` of the layer so the SDF has margin to bleed).
2. **Binary mask** it: alpha ≥ 128 → inside, else outside.
3. **Distance transform** (below) → a signed distance per texel.
4. **Encode** to one byte and write it into the glyph's layer of the atlas array.

The result is a single `r8unorm` 2D-**array** texture, one glyph per layer, uploaded once.

## The distance transform: 8SSEDT

Computing the exact nearest-edge distance for every texel naively is $O(n^2)$ per texel. Instead we use **8SSEDT** — *8-points Signed Sequential Euclidean Distance Transform* — which approximates it in two linear sweeps.

Each texel stores a **vector offset** $(\Delta x, \Delta y)$ to its nearest source texel (a source = a texel of the target class). Sources start at $(0,0)$; everything else starts at a large sentinel. Then two sweeps propagate offsets between neighbours:

- **Forward sweep** (top-left → bottom-right) pulls from the four already-visited neighbours above/left.
- **Backward sweep** (bottom-right → top-left) pulls from the four below/right.

Propagation keeps whichever offset is shorter. If a neighbour at relative step $(dx, dy)$ holds offset $o_n$, the candidate offset for the current texel is:

$$ o_{\text{cand}} = o_n - (dx, dy), \qquad \text{keep if } \lVert o_{\text{cand}} \rVert^2 < \lVert o_{\text{cur}} \rVert^2 $$

(because *source* $= \text{neighbor.pos} + o_n$, and we want $o = \text{source} - \text{my.pos}$). After both sweeps, distance is just $\lVert (\Delta x, \Delta y) \rVert$.

## Signed = two transforms

A single transform gives unsigned distance. To get the **sign**, we run the transform twice — once treating *inside* texels as sources, once treating *outside* texels as sources — and combine:

$$
\text{signed} = \begin{cases} +\,\text{distFromOutside} & \text{texel inside} \\ -\,\text{distFromInside} & \text{texel outside} \end{cases}
$$

So the value is **positive inside, negative outside, zero on the edge**.

## Encoding

The signed distance (in pixels) is squashed into a single unsigned byte over a useful range `±SPREAD` (8 px):

$$ \text{byte} = \operatorname{clamp}\!\left(\operatorname{round}\!\left(\frac{d + \text{SPREAD}}{2\,\text{SPREAD}} \cdot 255\right),\,0,\,255\right) $$

So the **edge (d = 0) lands at byte 127** (≈ 0.5 after `r8unorm` normalization) — exactly the `0.5` threshold the glyph shader samples against. `±SPREAD` maps to 0 and 255; distances beyond saturate.

## Why an array texture

One layer per glyph means the render shader can pick a glyph with a single integer index (`textureSample(atlas, sampler, localUv, glyphIndex)`) — no atlas-packing UV math, no bleeding between glyphs. The index comes from `hash(seed, row)` per cell.
