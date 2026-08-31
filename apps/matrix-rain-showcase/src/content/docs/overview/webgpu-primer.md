---
title: WebGPU primer
sidebar:
  order: 2
---

A quick tour of the WebGPU concepts the rest of these docs assume. If you've done modern graphics work, skim it; if not, this is enough to follow the deep dives. Where it helps, each concept is tied to where this project uses it.

## Adapter & device

WebGPU is reached through `navigator.gpu`. You request an **adapter** (a handle to a physical GPU) and from it a **device** (your logical connection used to create resources and submit work). This project never touches these directly — [TypeGPU](https://docs.swmansion.com/TypeGPU/)'s React integration owns the device — but `isWebGPUSupported()` is really just "does `navigator.gpu` exist".

## Buffers: uniform vs storage

GPU memory you allocate. Two kinds matter here:

- **Uniform buffer** — small, **read-only** in shaders, the same value broadcast to every shader invocation. Ideal for per-frame parameters. → our [`Uniforms`](/matrix-rain-webgpu/architecture/data-model/) (time, resolution, effect knobs).
- **Storage buffer** — larger, **read-write** in shaders, indexable as an array. Needed when the GPU itself mutates data. → our [`Column[]`](/matrix-rain-webgpu/architecture/data-model/) particle state, which the compute pass advances.

The distinction is load-bearing: column state *must* be a storage buffer because the compute shader writes to it; the parameter block *can* be a uniform because it's only read.

## Textures, samplers, views

A **texture** is GPU image memory; a **sampler** describes how to read it (filtering, addressing); a **view** exposes a texture to a shader in a particular shape. This project bakes its glyphs into a 2D-**array** texture (one glyph per layer) and samples it with bilinear filtering — see the [SDF atlas](/matrix-rain-webgpu/how-it-works/sdf-atlas/).

## Bind groups

Shaders don't reach out for resources; resources are bound to them. A **bind group** is a bundle of resources (buffers, texture views, samplers) matching a declared **layout**, attached before a draw/dispatch. TypeGPU generates these from typed declarations.

## Passes: render vs compute

Work is recorded into **passes** and submitted:

- A **render pass** runs the vertex → fragment pipeline and writes to one or more target textures (an *attachment*). Our glyph, bloom, and CRT passes are render passes.
- A **compute pass** runs a compute shader over a grid of workgroups, with no fixed output — it reads/writes storage buffers/textures. Our simulation step is a compute pass that advances `Column[]`.

This effect is essentially **one compute pass** (advance the sim) followed by **a chain of render passes** (draw + post-process). See the [Pipeline overview](/matrix-rain-webgpu/architecture/pipeline-overview/).

## The full-screen fragment trick

Several passes here have no real geometry — they run a fragment shader over the whole screen by drawing a single triangle that covers the viewport (`draw(3)`). The fragment shader then does all the work per pixel: deciding which glyph cell a pixel is in, sampling a texture, blurring, etc. It's the standard way to do image-space / post-processing work on the GPU.

## WGSL and the `'use gpu'` directive

GPU shaders are written in **WGSL** (WebGPU Shading Language). TypeGPU lets you write shader logic in TypeScript and compiles it to WGSL: functions tagged with the `'use gpu'` directive are transformed at build time (by `unplugin-typegpu`) into WGSL-emitting code. That's why the build pipeline must run that plugin — and why the shader code in this repo reads like TypeScript but runs on the GPU.

## The swap chain

The canvas's drawable surface. The final pass writes here; the browser presents it. Intermediate passes write to **offscreen** textures instead — this project renders glyphs and bloom into HDR (`rgba16float`) offscreen targets and only the last pass (CRT or a plain blit) writes the swap chain.
