import { useCallback, useRef, useState, type RefObject } from 'react';
import { useConfigureContext, useFrame } from '@typegpu/react';

import { GLYPH_COUNT } from '@lib/gpu/atlas/glyph-set';
import { useMatrixRainRenderer } from '@lib/hooks/use-matrix-rain-renderer';
import { useAtlasDebugRenderer } from './hooks/use-atlas-debug-renderer';
import { DebugPanel } from './debug-panel/DebugPanel';
import type { RenderMode } from './debug-panel/RenderMode';

const DEFAULT_FONT_SIZE = 20;
const DEFAULT_DENSITY = 0.95;
// 2D reference uses frameRate=20 but its low-alpha fade overlay softens
// motion perceptually. Our crisp per-cell render needs ~half that rate to
// feel comparable; 10 matches the 2D's perceived speed.
const DEFAULT_STEP_RATE = 10;
const DEFAULT_SPEED_RANGE: [number, number] = [0.4, 1.5];
const DEFAULT_TAIL_RANGE: [number, number] = [8, 35];
const DEFAULT_DEPTH_DIM = 0.3;
const DEFAULT_BLOOM_ENABLED = true;
const DEFAULT_BLOOM_THRESHOLD = 0.8;
const DEFAULT_BLOOM_INTENSITY = 1.5;
const DEFAULT_BLOOM_EMISSION = 1.1;
const DEFAULT_CRT_ENABLED = true;
const DEFAULT_SCANLINE_STRENGTH = 0.3;
const DEFAULT_ABERRATION = 1.0;
const DPR = window.devicePixelRatio || 1;

function App() {
  const fpsValueRef = useRef(0);
  const lastFlushRef = useRef(0);
  // FPS is observability-only. We write it straight to this DOM node from the
  // frame loop rather than through React state: a per-second setState would
  // re-render <App>, and every commit makes @typegpu/react reassign
  // canvas.width — which resets the WebGPU drawing buffer and flashes one
  // black frame. Keeping it out of React state avoids that entirely.
  const fpsNodeRef: RefObject<HTMLElement | null> = useRef<HTMLElement | null>(null);

  const { ref: configureRef, ctxRef } = useConfigureContext({
    autoResize: true,
    alphaMode: 'premultiplied',
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const setCanvas = useCallback(
    (el: HTMLCanvasElement | null) => {
      canvasRef.current = el;
      configureRef(el);
    },
    [configureRef],
  );

  const [renderMode, setRenderMode] = useState<RenderMode>('matrix-rain');
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [stepRate, setStepRate] = useState(DEFAULT_STEP_RATE);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [atlasLayer, setAtlasLayer] = useState(0);
  const [speedRange, setSpeedRange] = useState<[number, number]>(DEFAULT_SPEED_RANGE);
  const [tailRange, setTailRange] = useState<[number, number]>(DEFAULT_TAIL_RANGE);
  const [depthDim, setDepthDim] = useState(DEFAULT_DEPTH_DIM);
  const [bloomEnabled, setBloomEnabled] = useState(DEFAULT_BLOOM_ENABLED);
  const [bloomThreshold, setBloomThreshold] = useState(DEFAULT_BLOOM_THRESHOLD);
  const [bloomIntensity, setBloomIntensity] = useState(DEFAULT_BLOOM_INTENSITY);
  const [bloomEmission, setBloomEmission] = useState(DEFAULT_BLOOM_EMISSION);
  const [crtEnabled, setCrtEnabled] = useState(DEFAULT_CRT_ENABLED);
  const [scanlineStrength, setScanlineStrength] = useState(DEFAULT_SCANLINE_STRENGTH);
  const [aberration, setAberration] = useState(DEFAULT_ABERRATION);
  const [paused, setPaused] = useState(false);
  // Canvas size: "fit to window" lets the frame fill the stage (autoResize tracks
  // it); turning it off pins explicit px dimensions so the split-purpose resize
  // path can be exercised deliberately (width change re-seeds, height-only preserves).
  const [fitToWindow, setFitToWindow] = useState(true);
  const [canvasWidth, setCanvasWidth] = useState(960);
  const [canvasHeight, setCanvasHeight] = useState(540);
  const applyCanvasPreset = useCallback((width: number, height: number) => {
    setFitToWindow(false);
    setCanvasWidth(width);
    setCanvasHeight(height);
  }, []);
  // Debug panel open/closed — only meaningful on narrow screens, where the rail
  // becomes a slide-in drawer. On desktop the rail is always shown (CSS grid).
  const [panelOpen, setPanelOpen] = useState(false);

  const isAtlasDebug = renderMode === 'atlas-debug';

  const {
    tick: tickRain,
    regenerate,
    columnCount,
  } = useMatrixRainRenderer({
    ctxRef,
    cellSize: fontSize * DPR,
    density,
    stepRate,
    tailRange,
    bloom: {
      enabled: bloomEnabled,
      intensity: bloomIntensity,
      threshold: bloomThreshold,
      emission: bloomEmission,
    },
    crt: { enabled: crtEnabled, scanlineStrength, aberration },
    parallax: { speedRange, depthDim },
    paused,
  });

  // Atlas-debug is a demo-only diagnostic — it lives here, not in the published
  // library. It draws into the same canvas; the frame loop picks which to render.
  const { tick: atlasTick } = useAtlasDebugRenderer({ ctxRef, atlasLayer });

  useFrame(({ deltaSeconds, elapsedSeconds }) => {
    if (!ctxRef.current) {
      return;
    }
    if (deltaSeconds > 0) {
      fpsValueRef.current = fpsValueRef.current * 0.9 + (1 / deltaSeconds) * 0.1;
    }
    if (elapsedSeconds - lastFlushRef.current > 1.0) {
      if (fpsNodeRef.current) {
        fpsNodeRef.current.textContent = fpsValueRef.current.toFixed(0);
      }
      lastFlushRef.current = elapsedSeconds;
    }

    if (isAtlasDebug) {
      atlasTick();
    } else {
      tickRain(deltaSeconds, elapsedSeconds);
    }
  });

  return (
    <div id="shell">
      <section id="stage">
        <div
          id="canvas-frame"
          style={fitToWindow ? undefined : { width: canvasWidth, height: canvasHeight }}
        >
          <canvas ref={setCanvas} />
        </div>
      </section>
      <DebugPanel
        canvasRef={canvasRef}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        renderMode={renderMode}
        onRenderModeChange={setRenderMode}
        fpsRef={fpsNodeRef}
        columnCount={columnCount}
        density={density}
        stepRate={stepRate}
        fontSize={fontSize}
        atlasLayer={atlasLayer}
        atlasLayerMax={GLYPH_COUNT - 1}
        atlasDebugActive={isAtlasDebug}
        speedRange={speedRange}
        tailRange={tailRange}
        depthDim={depthDim}
        bloomEnabled={bloomEnabled}
        bloomThreshold={bloomThreshold}
        bloomIntensity={bloomIntensity}
        bloomEmission={bloomEmission}
        crtEnabled={crtEnabled}
        scanlineStrength={scanlineStrength}
        aberration={aberration}
        paused={paused}
        fitToWindow={fitToWindow}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        onFitToWindowChange={setFitToWindow}
        onCanvasWidthChange={setCanvasWidth}
        onCanvasHeightChange={setCanvasHeight}
        onCanvasPreset={applyCanvasPreset}
        onDensityChange={setDensity}
        onStepRateChange={setStepRate}
        onFontSizeChange={setFontSize}
        onAtlasLayerChange={setAtlasLayer}
        onSpeedRangeChange={setSpeedRange}
        onTailRangeChange={setTailRange}
        onDepthDimChange={setDepthDim}
        onBloomEnabledChange={setBloomEnabled}
        onBloomThresholdChange={setBloomThreshold}
        onBloomIntensityChange={setBloomIntensity}
        onBloomEmissionChange={setBloomEmission}
        onCrtEnabledChange={setCrtEnabled}
        onScanlineStrengthChange={setScanlineStrength}
        onAberrationChange={setAberration}
        onPausedChange={setPaused}
        onRegenerate={regenerate}
      />
    </div>
  );
}

export default App;
