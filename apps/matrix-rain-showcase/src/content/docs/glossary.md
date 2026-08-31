---
title: Glossary
sidebar:
  order: 1
---

Terms used across these docs.

**Adapter / device** — a handle to a physical GPU, and the logical connection used to create resources and submit work. See the [WebGPU primer](/matrix-rain-webgpu/overview/webgpu-primer/).

**Bind group** — a bundle of GPU resources (buffers, texture views, samplers) attached to a shader before a draw/dispatch, matching a declared layout.

**Bloom** — a glow post-process: extract bright pixels, blur them, add them back. See [Bloom](/matrix-rain-webgpu/how-it-works/bloom/).

**Cell** — one glyph slot in the grid, `cellSize` device pixels square. A column is a vertical stack of cells.

**Chromatic aberration** — a CRT artifact where color channels are offset slightly, splitting R/B from G along an axis.

**Compute pass** — GPU work that runs a compute shader over a grid of workgroups and reads/writes storage buffers, with no render attachment. Here: the simulation step.

**Column** — one falling stream of rain; the per-column state record (`headY`, `speed`, `depth`, `tailLength`, `seed`). Stored in a storage buffer. See [Data model](/matrix-rain-webgpu/architecture/data-model/).

**Device pixels (drawing-buffer pixels)** — the canvas's actual pixel resolution, `CSS px × devicePixelRatio`. All shader math here is in device pixels.

**DPR (`devicePixelRatio`)** — ratio of device pixels to CSS pixels; the component multiplies `fontSize` by it so `cellSize` is in device px.

**`fwidth`** — a shader built-in giving the screen-space rate of change of a value (≈ how much it changes between adjacent pixels). Used to size the anti-aliasing band to ~1px. See [Glyph rendering](/matrix-rain-webgpu/how-it-works/glyph-rendering/).

**HDR target** — an offscreen `rgba16float` texture that can hold values above 1.0, giving bloom and tone-mapping real range.

**Particle system** — a simulation of many independent points with position/velocity. The rain columns are a 1D particle system.

**SDF (signed distance field)** — an image where each texel stores the signed distance to the nearest glyph edge (negative outside, positive inside, zero at the edge). Lets text render crisp at any scale. See [SDF atlas](/matrix-rain-webgpu/how-it-works/sdf-atlas/).

**8SSEDT** — *8-points Signed Sequential Euclidean Distance Transform*, the algorithm used to compute the SDF from a rasterized glyph.

**Separable blur** — a 2D Gaussian blur done as two cheap 1D passes (horizontal then vertical) instead of one expensive 2D kernel. Used by bloom.

**`smoothstep`** — a shader built-in giving a smooth 0→1 ramp between two edges; used with the SDF value to get anti-aliased coverage.

**Storage buffer** — GPU memory that shaders can read **and write**, indexable as an array. The `Column[]` state lives here.

**Swap chain** — the canvas's presentable surface; the final pass writes to it.

**TGSL / `'use gpu'`** — TypeGPU's mechanism for writing shader logic in TypeScript; functions tagged `'use gpu'` are compiled to WGSL at build time by `unplugin-typegpu`.

**Tone-mapping** — mapping (possibly >1.0) HDR colors into the 0..1 display range. This project clamps rather than using Reinhard (see [CRT](/matrix-rain-webgpu/how-it-works/crt/)).

**Uniform buffer** — small, read-only-in-shader GPU memory broadcast to every invocation; the per-frame parameter block (`Uniforms`).

**WGSL** — WebGPU Shading Language, the language GPU shaders compile to.
