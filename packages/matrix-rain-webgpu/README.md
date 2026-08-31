# matrix-rain-webgpu

[![npm](https://img.shields.io/npm/v/matrix-rain-webgpu)](https://www.npmjs.com/package/matrix-rain-webgpu)
[![CI](https://github.com/chicio/chicio-blog/actions/workflows/ci.yml/badge.svg)](https://github.com/chicio/chicio-blog/actions/workflows/ci.yml)
[![Deploy](https://github.com/chicio/chicio-blog/actions/workflows/pages.yml/badge.svg)](https://github.com/chicio/chicio-blog/actions/workflows/pages.yml)

> A Matrix-style "digital rain" background effect for React, rendered on the GPU with WebGPU via [TypeGPU](https://docs.swmansion.com/TypeGPU/). GPU-driven simulation, signed-distance-field glyphs, depth parallax, bloom, and a CRT post-process.

**▶ Live demo & full documentation: https://chicio.github.io/chicio-blog/matrix-rain/**

It powers the animated background on [fabrizioduroni.it](https://www.fabrizioduroni.it). Requires a WebGPU-capable browser (recent Chrome / Edge / Safari / Firefox).

## Install

```sh
npm install matrix-rain-webgpu react react-dom
```

`react`/`react-dom` (v19) are peer dependencies. The TypeGPU packages
(`typegpu`/`@typegpu/react`/`@typegpu/noise`) are regular dependencies, exact-pinned to
versions this library is tested against — you don't install or track them yourself. The
shaders are pre-compiled at publish time, so you do **not** need any TypeGPU build plugin.

> **Using TypeGPU directly in your app?** Align your `typegpu`/`@typegpu/*` versions with
> the ones this package pins (see its `package.json`): npm then dedupes to a single
> instance. Two different copies of `typegpu` or `@typegpu/react` in one bundle break the
> `'use gpu'` shader registry and the shared root context.

> **Module resolution:** the published types target bundler-style resolution
> (`moduleResolution: "bundler"` / `"node"`), which is what Vite, Next.js, and most React
> setups use. Strict `"node16"`/`"nodenext"` resolution isn't supported yet.

## Usage

The component renders a `<canvas>` that fills its positioned parent and ignores pointer events:

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

Everything is optional and grouped — omit for defaults, pass an object to tune, or `false` to disable an effect:

```tsx
<MatrixRainWebGPU rain={{ fontSize: 24 }} bloom={{ intensity: 2 }} crt={false} />
```

WebGPU isn't available everywhere; gate on `isWebGPUSupported()` and render your own fallback when it's missing:

```tsx
import { MatrixRainWebGPU, isWebGPUSupported } from 'matrix-rain-webgpu';

return isWebGPUSupported() ? <MatrixRainWebGPU /> : <My2DFallback />;
```

## Documentation

Full docs live on the site — including the interactive playground:

- **[Getting started](https://chicio.github.io/chicio-blog/matrix-rain/overview/getting-started/)** & **[Public API](https://chicio.github.io/chicio-blog/matrix-rain/usage/public-api/)** — install, props, recipes.
- **[Architecture](https://chicio.github.io/chicio-blog/matrix-rain/architecture/pipeline-overview/)** — how the pieces connect.
- **[How it works](https://chicio.github.io/chicio-blog/matrix-rain/how-it-works/glyph-rendering/)** — per-component deep dives, with the computer-graphics concepts and the math.
- **[Playground](https://chicio.github.io/chicio-blog/matrix-rain/playground/)** — the live demo with every knob exposed.

## Local development

This repo is two packages: the publishable library at the root (`src/`) and the docs + demo site (`docs/`, an Astro + Starlight app).

```sh
# Library — typecheck + lint/format
npm install
npm run types
npm run check

# Docs + demo site (Astro)
npm --prefix docs install
npm --prefix docs run dev
```

## Author

Built by [Fabrizio Duroni](https://www.fabrizioduroni.it). If you enjoy it, a visit to the site is the best way to support the work. Also don't forget :star: to star this repository :star:.
