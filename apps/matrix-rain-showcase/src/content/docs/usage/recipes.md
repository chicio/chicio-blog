---
title: Recipes
sidebar:
  order: 2
---

Common patterns for using `<MatrixRainWebGPU>`. See the [Public API](/matrix-rain-webgpu/usage/public-api/) for every option.

## Full-screen background behind content

The canvas fills its positioned parent and ignores pointer events, so put it behind your content with a positioned wrapper:

```tsx
<div style={{ position: 'relative', minHeight: '100dvh' }}>
  <div style={{ position: 'absolute', inset: 0 }}>
    <MatrixRainWebGPU />
  </div>
  <main style={{ position: 'relative' }}>{children}</main>
</div>
```

## Compose `paused` from reduced-motion + visibility

`paused` is the single off-state knob — merge every "should it stop" signal into it yourself:

```tsx
import { useReducedMotion } from 'framer-motion'; // or your own
function useShouldPause(ref: RefObject<Element>) {
  const reduced = useReducedMotion();
  const [offscreen, setOffscreen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting));
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return reduced || offscreen;
}

// <MatrixRainWebGPU paused={useShouldPause(wrapperRef)} />
```

When `paused` flips on, the effect freezes on a settled frame and stops the loop; flipping it off resumes from that state.

## Disable effects

Pass `false` to drop an effect entirely:

```tsx
// Minimal: no bloom, no CRT, no depth — a flat, cheap field.
<MatrixRainWebGPU bloom={false} crt={false} parallax={false} />
```

Disabling `bloom`/`crt` also skips their GPU passes (a real cost saving), not just zeroes them.

## Tune the look

```tsx
<MatrixRainWebGPU
  rain={{ fontSize: 28, density: 0.97, stepRate: 14, tailRange: [10, 40] }}
  parallax={{ speedRange: [0.3, 1.8], depthDim: 0.5 }}
  bloom={{ intensity: 2, threshold: 0.7 }}
  crt={{ scanlineStrength: 0.2, aberration: 0.5 }}
/>
```

Every field is optional; omit any to keep its default. The [Playground](/matrix-rain-webgpu/playground/) is the fastest way to dial these in by eye.

## Feature-detect with a fallback

```tsx
import { MatrixRainWebGPU, isWebGPUSupported } from 'matrix-rain-webgpu';

const canRun = useMemo(() => isWebGPUSupported(), []);
return canRun ? <MatrixRainWebGPU /> : <My2DFallback />;
```

## Report errors

The component never throws into your tree; on a fatal renderer error it renders `null` and calls `onError` once:

```tsx
<MatrixRainWebGPU
  onError={(err) => {
    setRainFailed(true); // swap in a fallback, log, etc.
    console.warn('matrix-rain disabled:', err);
  }}
/>
```

## Known limitations

**Black canvas after long OS sleep.** When the machine sleeps for an extended period, the browser can silently drop the canvas's WebGPU swap chain while the render loop keeps running — frames advance but nothing paints. The component re-configures the context when the tab returns to `visible`, which heals the common background→foreground case (tab switch, short sleep). Some deep-sleep wakes never fire `visibilitychange`, so the canvas can stay black until the page is reloaded. If your app needs to be bulletproof against this, remount the component (e.g. via a `key` you bump) or reload on resume.
