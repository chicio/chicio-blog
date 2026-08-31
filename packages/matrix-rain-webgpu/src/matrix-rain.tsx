import { useEffect, type CSSProperties } from 'react';
import { useConfigureContext, useFrame, useRootWithStatus } from '@typegpu/react';

import { useMatrixRainRenderer } from './hooks/use-matrix-rain-renderer';
import { PALETTE } from './gpu/material/palette';
import {
  type BloomConfig,
  type BloomOptions,
  type CrtConfig,
  type CrtOptions,
  type MatrixRainProps,
  type ParallaxConfig,
  type ParallaxOptions,
  type RainConfig,
  type RainOptions,
} from './types';

// Default values, mirroring the public group shape. Tuned-by-eye across M4–M7;
// they supersede the pre-implementation guesses in spec §5.2. Component-local
// (not a public export) — consumers override per-field via props.
const DEFAULTS: {
  rain: Required<RainOptions>;
  parallax: Required<ParallaxOptions>;
  bloom: Required<BloomOptions>;
  crt: Required<CrtOptions>;
} = {
  rain: { fontSize: 20, density: 0.95, stepRate: 10, tailRange: [8, 35] },
  parallax: { speedRange: [0.4, 1.5], depthDim: 0.3 },
  bloom: { intensity: 1.5, threshold: 0.8, emission: 1.1 },
  crt: { scanlineStrength: 0.3, aberration: 1.0 },
};

// One-time snapshot — matches the hook's DPR convention (cellSize is in device px).
const DPR = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;

// The rain's own background, as CSS — so the canvas shows the matrix backdrop (not
// a transparent/white rectangle) during the load gap before the first WebGPU frame
// paints (async atlas bake + autoResize). Derived from PALETTE so there's one source.
const [bgR, bgG, bgB] = PALETTE.background;
const BACKGROUND_CSS = `rgb(${Math.round(bgR * 255)}, ${Math.round(bgG * 255)}, ${Math.round(bgB * 255)})`;

// The canvas fills its parent and ignores pointer events; the consumer sizes the
// parent and owns positioning context. Mirrors the existing 2D component so the
// two are layout-swappable.
const CANVAS_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  pointerEvents: 'none',
  backgroundColor: BACKGROUND_CSS,
};

// Resolve each public group into a complete internal config: every field filled
// from DEFAULTS. Effect groups also derive an explicit `enabled` from `| false`.
function resolveRain(opt: RainOptions | undefined): RainConfig {
  return {
    fontSize: opt?.fontSize ?? DEFAULTS.rain.fontSize,
    density: opt?.density ?? DEFAULTS.rain.density,
    stepRate: opt?.stepRate ?? DEFAULTS.rain.stepRate,
    tailRange: opt?.tailRange ?? DEFAULTS.rain.tailRange,
  };
}

function resolveBloom(opt: BloomOptions | false | undefined): BloomConfig {
  return {
    enabled: opt !== false,
    intensity: (opt || undefined)?.intensity ?? DEFAULTS.bloom.intensity,
    threshold: (opt || undefined)?.threshold ?? DEFAULTS.bloom.threshold,
    emission: (opt || undefined)?.emission ?? DEFAULTS.bloom.emission,
  };
}

function resolveCrt(opt: CrtOptions | false | undefined): CrtConfig {
  return {
    enabled: opt !== false,
    scanlineStrength: (opt || undefined)?.scanlineStrength ?? DEFAULTS.crt.scanlineStrength,
    aberration: (opt || undefined)?.aberration ?? DEFAULTS.crt.aberration,
  };
}

function resolveParallax(opt: ParallaxOptions | false | undefined): ParallaxConfig {
  // Disabled → uniform speed + no dimming (the genuinely flat look); the resolved
  // values themselves encode the behavior, so downstream code needn't re-check.
  if (opt === false) {
    return { speedRange: [1, 1], depthDim: 0 };
  }
  return {
    speedRange: opt?.speedRange ?? DEFAULTS.parallax.speedRange,
    depthDim: opt?.depthDim ?? DEFAULTS.parallax.depthDim,
  };
}

/**
 * WebGPU Matrix-rain background effect. Renders a `<canvas>` that fills its
 * positioned parent. Returns `null` (and reports via `onError`/`console.warn`)
 * when WebGPU is unavailable or init fails — it never throws into the host tree.
 */
export function MatrixRainWebGPU(props: MatrixRainProps) {
  const root = useRootWithStatus();
  const status = root.status;
  const initError = status === 'rejected' ? root.reason : undefined;
  const onError = props.onError;

  useEffect(() => {
    if (status !== 'rejected') {
      return;
    }
    const err = initError instanceof Error ? initError : new Error(String(initError));
    if (onError) {
      onError(err);
    } else {
      console.warn('[matrix-rain] WebGPU unavailable; rendering nothing.', err);
    }
  }, [status, initError, onError]);

  // Pending (root still initializing) or rejected → render nothing. Only once the
  // root is fulfilled do we mount the inner component, whose useRoot() is then safe.
  if (status !== 'fulfilled') {
    return null;
  }
  return <MatrixRainCanvas {...props} />;
}

function MatrixRainCanvas(props: MatrixRainProps) {
  const { ref, ctxRef } = useConfigureContext({ autoResize: true, alphaMode: 'premultiplied' });

  const rain = resolveRain(props.rain);
  const renderer = useMatrixRainRenderer({
    ctxRef,
    cellSize: rain.fontSize * DPR,
    density: rain.density,
    stepRate: rain.stepRate,
    tailRange: rain.tailRange,
    bloom: resolveBloom(props.bloom),
    crt: resolveCrt(props.crt),
    parallax: resolveParallax(props.parallax),
    paused: props.paused ?? false,
    onError: props.onError,
  });

  useFrame(({ deltaSeconds, elapsedSeconds }) => {
    renderer.tick(deltaSeconds, elapsedSeconds);
  });

  return <canvas ref={ref} className={props.className} style={CANVAS_STYLE} />;
}
