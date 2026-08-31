---
title: Introduction
sidebar:
  order: 1
---

**matrix-rain-webgpu** is a Matrix-style "digital rain" background effect for React, rendered on the GPU with [WebGPU](https://www.w3.org/TR/webgpu/) via [TypeGPU](https://docs.swmansion.com/TypeGPU/).

It drops in as a single component:

```tsx
import { MatrixRainWebGPU } from 'matrix-rain-webgpu';

<MatrixRainWebGPU />;
```

…and renders falling columns of kana/glyphs with a bright head, a fading trail, depth parallax, a bloom glow, and a subtle CRT scanline/aberration pass — all on the GPU.

## Why a WebGPU rewrite?

The effect began its life as a 2D `<canvas>` implementation on [fabrizioduroni.it](https://www.fabrizioduroni.it). That version works, but every frame is CPU-driven pixel work: clearing, fading, and drawing each glyph.

The push to rebuild it on the GPU came from [App.js Conf 2026](https://www.fabrizioduroni.it/blog/post/2026/06/01/app-js-conf-2026): I came back inspired by the talk on [TypeGPU](https://docs.swmansion.com/TypeGPU/) and decided to dust off my computer-graphics knowledge, with AI as a pair-programmer, and build something cool, the way I used to years ago when I was a computer-graphics enthusiast. "Was" is underselling it: my thesis was [Spectral Clara Lux Tracer](https://github.com/chicio/Spectral-Clara-Lux-Tracer), a physically based ray/path tracer with spectral rendering and CRI light evaluation. Computer graphics is still the field I love the most, so this rewrite is less a new hobby than picking up a thread I never really put down.

Moving it to the GPU also unlocks things the 2D version can't do well:

- **Render every cell in parallel** in a fragment shader, instead of looping on the CPU.
- **Advance the simulation in a compute pass**, so column state lives and updates on the GPU.
- **Add effects 2D can't do cheaply** — real bloom, per-column depth parallax, a CRT post-process — as extra GPU passes.

So it's equal parts shippable package and study project: a vehicle for relearning computer-graphics techniques (signed-distance-field text, separable blur, distance transforms) and the WebGPU/TypeGPU API in a real artifact.

## Goals

- A reusable, published npm package with a small, typed public API.
- A faithful, punchier successor to the original 2D effect — usable as a drop-in background, with a 2D fallback where WebGPU is unavailable.
- Documentation (this site) that explains both the **graphics concepts** (with the math) and the **TypeGPU/WebGPU APIs** used, component by component.

## Browser support

WebGPU is available in current Chrome/Edge, Safari, and Firefox, but not everywhere. The component fails safe — it renders nothing (and reports via `onError`) when WebGPU is missing — and the package exports [`isWebGPUSupported()`](/matrix-rain-webgpu/usage/public-api/#iswebgpusupported) so you can choose a fallback. See [Getting started](/matrix-rain-webgpu/overview/getting-started/).

## How to read these docs

- **[Getting started](/matrix-rain-webgpu/overview/getting-started/)** and **[Public API](/matrix-rain-webgpu/usage/public-api/)** — install and use it.
- **[WebGPU primer](/matrix-rain-webgpu/overview/webgpu-primer/)** — the WebGPU concepts the rest of the docs assume.
- **[Architecture](/matrix-rain-webgpu/architecture/pipeline-overview/)** — how the pieces connect.
- **How it works** — per-component deep dives into the graphics and the math.
- **[Playground](/matrix-rain-webgpu/playground/)** — the live demo with every knob exposed.
