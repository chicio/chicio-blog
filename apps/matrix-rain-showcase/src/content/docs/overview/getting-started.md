---
title: Getting started
sidebar:
  order: 3
---

## Install

```sh
npm install matrix-rain-webgpu react react-dom
```

`react` and `react-dom` (v19) are peer dependencies — you'll already have them in a React app.
The TypeGPU packages (`typegpu`, `@typegpu/react`, `@typegpu/noise`) come along as regular
dependencies, exact-pinned to the versions this library is tested against. If your app uses
TypeGPU directly too, align your versions with those pins so npm dedupes to a single instance —
duplicate `typegpu` copies break the `'use gpu'` shader registry.

## Basic usage

The component renders a `<canvas>` that fills its **positioned parent**, so wrap it in a sized, positioned container:

```tsx
import { MatrixRainWebGPU } from 'matrix-rain-webgpu';

export function Background() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100dvh' }}>
      <MatrixRainWebGPU />
    </div>
  );
}
```

The canvas is `pointer-events: none`, so it won't intercept clicks — layer your content above it.

## Tuning

Everything is optional and grouped. Omit a group for defaults, pass an object to tune, or pass `false` to disable an effect:

```tsx
<MatrixRainWebGPU
  rain={{ fontSize: 24, density: 0.97 }}
  bloom={{ intensity: 2 }}
  crt={false}
/>
```

See the [Public API](/matrix-rain-webgpu/usage/public-api/) for every option and its default.

## Feature detection & fallback

WebGPU isn't everywhere yet. Gate on `isWebGPUSupported()` and render your own fallback (for example, the original 2D canvas effect) when it's missing:

```tsx
import { MatrixRainWebGPU, isWebGPUSupported } from 'matrix-rain-webgpu';

function Rain() {
  if (!isWebGPUSupported()) {
    return <My2DMatrixRain />; // your fallback
  }
  return <MatrixRainWebGPU />;
}
```

The component is also defensive on its own: if the GPU fails to initialize or a frame throws, it renders `null`, calls your `onError`, and never throws into your React tree.

```tsx
<MatrixRainWebGPU onError={(err) => console.warn('rain disabled:', err)} />
```

## Pausing

`paused` is the single off-state knob. Compose reduced-motion, offscreen (IntersectionObserver), and any user toggle into that one boolean yourself:

```tsx
const prefersReducedMotion = useReducedMotion();
<MatrixRainWebGPU paused={prefersReducedMotion || offscreen} />;
```

When `paused` flips on, the effect freezes on a settled frame; flipping it off resumes.
