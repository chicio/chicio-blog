---
title: Data model
sidebar:
  order: 2
---

Two GPU buffers drive everything, and they're deliberately different kinds (`src/gpu/schemas/`).

## `Column[]` — a storage buffer

Each column of rain is one record; the array of them is a **storage buffer** (`storage`, read-write on the GPU). The compute pass mutates it every step.

```ts
// src/gpu/schemas/column.ts
export const Column = d.struct({
  headY: d.f32,       // head position, in cells (can be negative / off-screen)
  speed: d.f32,       // fall speed, cells per step
  depth: d.f32,       // 0 (far/slow) .. 1 (near/fast) — drives parallax dimming
  tailLength: d.f32,  // trail length in cells, rolled per column
  seed: d.u32,        // PRNG seed → glyph choice + brightness jitter, rerolled on respawn
});
```

In computer-graphics terms the columns are a **1D particle system**: each `Column` is a particle with a position (`headY`) and velocity (`speed`) that the compute shader integrates each tick. It **must** be a storage buffer — uniforms are read-only and small, but this array is GPU-written (the heads advance, columns respawn, seeds reroll) and sized to the column count.

## `Uniforms` — a uniform buffer

The per-frame parameter block is a **uniform buffer**: CPU-patched each frame, read-only on the GPU, broadcast to every shader invocation.

```ts
// src/gpu/schemas/uniforms.ts
export const Uniforms = d.struct({
  time: d.f32,            // elapsed seconds (drives the time-seeded respawn roll)
  stepProgress: d.f32,    // 0..1 interpolation between discrete steps
  resolution: d.vec2f,    // drawing-buffer size in device px
  cellSize: d.f32,        // glyph cell size in device px (= fontSize × DPR)
  density: d.f32,
  depthDim: d.f32,        // parallax far-dimming
  bloomThreshold: d.f32,
  bloomIntensity: d.f32,
  scanlineStrength: d.f32,
  aberration: d.f32,
});
```

This is the "flat prefixed" boundary: the grouped public options (`bloom`, `crt`, `parallax`) are resolved on the CPU and written into these flat, prefixed fields (`bloomThreshold`, `scanlineStrength`, …) — WGSL uniform structs are flat by nature.

## Units & conventions

- **`resolution` and `cellSize` share the same space**: device (drawing-buffer) pixels. The consumer passes `fontSize` in CSS px; the component multiplies by `devicePixelRatio` before it reaches the shader, so all shader math stays unit-clean.
- **`headY` is in cells**, not pixels — a cell is `cellSize` device px tall. A column's visible cells are the ones between `headY - tailLength` and `headY`.
- **`seed` is per-column and stable** until respawn. Because a cell's glyph is `hash(seed, rowIndex)`, the characters stay fixed in place as the head slides past them — the head appears to move *through* fixed glyphs rather than scrolling them. See [Glyph rendering](/matrix-rain-webgpu/how-it-works/glyph-rendering/).

## Who reads/writes what

| Buffer | Written by | Read by |
|--------|-----------|---------|
| `Column[]` (storage) | compute pass (per step); CPU on (re)spawn/regenerate | compute pass, glyph render pass |
| `Uniforms` (uniform) | CPU, every frame | every pass |
