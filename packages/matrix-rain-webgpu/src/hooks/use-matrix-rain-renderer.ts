import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useRoot } from '@typegpu/react';
import { buildSdfAtlas, type SdfAtlas } from '../gpu/atlas/build-sdf-atlas';
import { createRenderGraph, type RenderGraph } from '../gpu/render-graph';
import type { BloomConfig, CrtConfig, ParallaxConfig } from '../types';

type UseMatrixRainRendererArgs = {
  ctxRef: RefObject<GPUCanvasContext | null>;
  cellSize: number;
  density: number;
  stepRate: number;
  tailRange: [number, number];
  bloom: BloomConfig;
  crt: CrtConfig;
  parallax: ParallaxConfig;
  paused: boolean;
  onError?: ((err: Error) => void) | undefined;
};

export type MatrixRainRenderer = {
  tick: (deltaSeconds: number, elapsedSeconds: number) => void;
  regenerate: () => void;
  columnCount: number;
};

export function useMatrixRainRenderer(args: UseMatrixRainRendererArgs): MatrixRainRenderer {
  const root = useRoot();
  const graphRef = useRef<RenderGraph | null>(null);
  const latestArgsRef = useRef(args);
  latestArgsRef.current = args;

  const [columnCount, setColumnCount] = useState(0);
  const lastColumnCountRef = useRef(0);
  const atlasRef = useRef<SdfAtlas | null>(null);
  // Once the tick throws, go inert: useFrame calls back ~60×/s, so without this
  // a single bug would spam the console and could hang the tab. No auto-retry —
  // a thrown renderer stays dead until the component remounts (page reload).
  const deadRef = useRef(false);

  // Best-effort heal for the common background→foreground case: the browser can
  // silently drop the canvas swap chain while the tab is hidden, leaving the loop
  // running blind (frames advance, screen stays black). Re-configure on return to
  // visible re-establishes it. This does NOT cover every wake path (e.g. deep
  // OS-sleep that never fires visibilitychange) — that residual edge case is a
  // known v1 limitation. Mirrors @typegpu/react's own configure, which otherwise
  // only re-runs on root change.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') {
        return;
      }
      const ctx = latestArgsRef.current.ctxRef.current;
      if (!ctx) {
        return;
      }
      ctx.configure({
        device: root.device,
        format: navigator.gpu.getPreferredCanvasFormat(),
        alphaMode: 'premultiplied',
      });
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [root]);

  // Bake the SDF atlas once on mount; cancelable in case the component unmounts mid-bake.
  useEffect(() => {
    let cancelled = false;
    buildSdfAtlas().then((result) => {
      if (!cancelled) {
        atlasRef.current = result;
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Disposal on unmount AND on cellSize change (next tick lazy-recreates with new value).
  useEffect(() => {
    return () => {
      graphRef.current?.dispose();
      graphRef.current = null;
      lastColumnCountRef.current = 0;
      setColumnCount(0);
    };
  }, [args.cellSize]);

  // Speed/tail ranges only affect per-column init, so a change re-rolls all
  // columns. Keyed on the primitive endpoints (extracted to locals, not the
  // array refs) so the effect fires exactly when a value moves, regardless of
  // array identity.
  const [speedMin, speedMax] = args.parallax.speedRange;
  const [tailMin, tailMax] = args.tailRange;
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) {
      return;
    }
    graph.setParallax(args.parallax);
    graph.setTailRange(args.tailRange);
    graph.regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speedMin, speedMax, tailMin, tailMax]);

  function tick(deltaSeconds: number, elapsedSeconds: number) {
    if (deadRef.current) {
      return;
    }
    try {
      tickBody(deltaSeconds, elapsedSeconds);
    } catch (err) {
      deadRef.current = true;
      graphRef.current?.dispose();
      graphRef.current = null;
      const error = err instanceof Error ? err : new Error(String(err));
      const onError = latestArgsRef.current.onError;
      if (onError) {
        onError(error);
      } else {
        console.error('[matrix-rain] renderer stopped after error:', error);
      }
    }
  }

  function tickBody(deltaSeconds: number, elapsedSeconds: number) {
    const ctx = latestArgsRef.current.ctxRef.current;
    const atlas = atlasRef.current;
    if (!ctx || !atlas) {
      return;
    }
    // @typegpu/react's autoResize sizes the drawing buffer inside a ResizeObserver
    // callback, which on Safari lands AFTER the first rAF (Chrome applies it before
    // first paint). Until then the buffer is the HTML canvas default 300×150; since
    // the canvas is CSS-stretched to fill its parent, rendering at that size flashes
    // one frame of magnified glyphs. Skip until the buffer leaves the default — any
    // resize away from it unblocks, so this never permanently stalls.
    const canvas = ctx.canvas;
    const bufferIsDefault = canvas.width === 300 && canvas.height === 150;
    const elementIsLarger =
      'clientWidth' in canvas && (canvas.clientWidth !== 300 || canvas.clientHeight !== 150);
    if (bufferIsDefault && elementIsLarger) {
      return;
    }
    if (!graphRef.current) {
      const graph = createRenderGraph({
        root,
        ctx,
        atlas,
        cellSize: latestArgsRef.current.cellSize,
        density: latestArgsRef.current.density,
        stepRate: latestArgsRef.current.stepRate,
        tailRange: latestArgsRef.current.tailRange,
        bloom: latestArgsRef.current.bloom,
        crt: latestArgsRef.current.crt,
        parallax: latestArgsRef.current.parallax,
      });
      // Settle once at birth so the very first frame is full (matters when
      // mounted with paused=true; also avoids the empty-then-fill startup ramp).
      graph.resize(ctx.canvas.width, ctx.canvas.height);
      graph.settle();
      graphRef.current = graph;
    }
    const graph = graphRef.current;
    graph.resize(canvas.width, canvas.height);

    graph.setDensity(latestArgsRef.current.density);
    graph.setStepRate(latestArgsRef.current.stepRate);
    graph.setParallax(latestArgsRef.current.parallax);
    graph.setBloom(latestArgsRef.current.bloom);
    graph.setCrt(latestArgsRef.current.crt);

    // Advance the simulation only while running; render every tick regardless.
    // Rendering even when paused is deliberate: toggling paused re-renders App,
    // which makes @typegpu/react reassign canvas.width and clear the buffer to
    // black — repainting each frame heals that (and resize-while-paused) without
    // moving the columns.
    if (!latestArgsRef.current.paused) {
      graph.step(deltaSeconds, elapsedSeconds);
    }
    graph.render();

    const current = graph.getColumnCount();
    if (current !== lastColumnCountRef.current) {
      lastColumnCountRef.current = current;
      setColumnCount(current);
    }
  }

  const regenerate = useCallback(() => {
    graphRef.current?.regenerate();
  }, []);

  return { tick, regenerate, columnCount };
}
