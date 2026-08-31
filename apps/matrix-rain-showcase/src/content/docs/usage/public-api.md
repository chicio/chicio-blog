---
title: Public API
sidebar:
  order: 1
---

The package exports exactly three things:

```ts
import { MatrixRainWebGPU, isWebGPUSupported } from 'matrix-rain-webgpu';
import type {
  MatrixRainProps,
  RainOptions,
  ParallaxOptions,
  BloomOptions,
  CrtOptions,
} from 'matrix-rain-webgpu';
```

- **`MatrixRainWebGPU`** — the React component.
- **`isWebGPUSupported()`** — a runtime feature check (see [Getting started](/matrix-rain-webgpu/overview/getting-started/)).
- The **option types**, exported so you can build a config in a typed variable.

## `<MatrixRainWebGPU>`

The component renders a single `<canvas>` that is positioned to **fill its parent** (`position: absolute; inset: 0; pointer-events: none`). You size it by sizing the parent. It never throws into your tree: if WebGPU is unavailable or init fails it renders `null` and reports once.

```tsx
<div style={{ position: 'relative', width: '100%', height: '100dvh' }}>
  <MatrixRainWebGPU />
</div>
```

### Props

Props are organized into groups. The base look lives in `rain`; the three effect layers — `parallax`, `bloom`, `crt` — are each `Options | false`: **omit** for defaults, pass an **object** to tune, pass **`false`** to disable.

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `rain` | `RainOptions` | _see below_ | Glyph size, density, step rate, trail length. |
| `parallax` | `ParallaxOptions \| false` | _see below_ | Depth illusion via per-column speed spread + far-dimming. |
| `bloom` | `BloomOptions \| false` | _see below_ | Glow post-process. |
| `crt` | `CrtOptions \| false` | _see below_ | Scanlines + chromatic aberration. |
| `paused` | `boolean` | `false` | Freeze on a settled static frame. The single off-state knob. |
| `className` | `string` | — | Forwarded to the `<canvas>`. |
| `onError` | `(err: Error) => void` | — | Called once if the renderer dies. |

### `rain`

| Field | Type | Default | Meaning |
|-------|------|---------|---------|
| `fontSize` | `number` | `20` | Glyph cell size, in **CSS pixels**. |
| `density` | `number` | `0.95` | Probability (0..1) a column does **not** respawn each step — higher = sparser. |
| `stepRate` | `number` | `10` | Logical simulation rate in Hz (rows advanced per second). |
| `tailRange` | `[number, number]` | `[8, 35]` | `[min, max]` trail length in cells, rolled per column. |

### `parallax` (`ParallaxOptions | false`)

| Field | Type | Default | Meaning |
|-------|------|---------|---------|
| `speedRange` | `[number, number]` | `[0.4, 1.5]` | `[min, max]` per-column fall speed; the spread creates the depth illusion. |
| `depthDim` | `number` | `0.3` | How strongly far (slow) columns are dimmed, 0 (flat) .. 1 (deep). |

`parallax={false}` → uniform speed + no dimming (a flat field).

### `bloom` (`BloomOptions | false`)

| Field | Type | Default | Meaning |
|-------|------|---------|---------|
| `intensity` | `number` | `1.5` | Glow strength multiplier on the extracted bright pass. |
| `threshold` | `number` | `0.8` | Brightness above which a pixel contributes to the glow (~0..2). |
| `emission` | `number` | `2` | How hot heads burn into the HDR target (1 = off). >1 pushes heads above the displayable range so bloom has real headroom — see [Bloom](/matrix-rain-webgpu/how-it-works/bloom/). |

`bloom={false}` skips the entire extract → blur → combine chain (a real GPU cost saving).

### `crt` (`CrtOptions | false`)

| Field | Type | Default | Meaning |
|-------|------|---------|---------|
| `scanlineStrength` | `number` | `0.3` | Scanline darkening depth, 0 (none) .. 1 (heavy). |
| `aberration` | `number` | `1.0` | Chromatic-aberration offset in pixels (R/B split along x). |

`crt={false}` swaps the final CRT pass for a plain passthrough.

## `isWebGPUSupported()`

```ts
function isWebGPUSupported(): boolean;
```

A synchronous best-effort check for `navigator.gpu`. Use it to decide whether to mount `<MatrixRainWebGPU>` or a fallback. The component does **not** feature-detect internally — it relies on the GPU root failing gracefully — so `isWebGPUSupported()` is the primary support gate for consumers.

## Error handling

`onError` is called **once** if the renderer dies — either init failure or a per-frame throw. After that the effect stays dead (no auto-retry). If you don't pass `onError`, the error is `console.error`'d instead. Either way the component renders `null` and **never throws** into the host React tree — a background effect must not crash the page.
