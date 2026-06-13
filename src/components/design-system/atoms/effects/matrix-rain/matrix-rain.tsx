"use client";

import { MatrixRainWebGPU, isWebGPUSupported } from "matrix-rain-webgpu";
import React, { memo, useRef, useState, useSyncExternalStore } from "react";
import { Matrix2DCanvas } from "./matrix-2d-canvas";
import { useMatrixRainActivity } from "./use-matrix-rain-activity";

const backgroundColor = `#00110010`;

type Mode = "pending" | "webgpu" | "fallback";

// WebGPU support is a static client capability. useSyncExternalStore lets the
// server + hydration render "pending" (the neutral backdrop) and the client
// then resolve to webgpu/fallback in a single mismatch-free transition — no
// setState-in-effect, no SSR access to `navigator`.
const subscribe = () => () => {};
const getMode = (): Mode => (isWebGPUSupported() ? "webgpu" : "fallback");
const getServerMode = (): Mode => "pending";

interface MatrixRainProps {
  fontSize?: number;
  density?: number;
}

const MatrixRainRenderer: React.FC<MatrixRainProps> = ({
  fontSize = 16,
  density = 0.95,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const paused = useMatrixRainActivity(containerRef);
  const detectedMode = useSyncExternalStore(subscribe, getMode, getServerMode);
  // Runtime safety net for "WebGPU present but adapter/init fails" — setState in
  // a callback, not an effect.
  const [webgpuFailed, setWebgpuFailed] = useState(false);
  const mode: Mode = webgpuFailed ? "fallback" : detectedMode;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute top-0 left-0 h-full w-full"
      style={{ backgroundColor }}
    >
      {mode === "webgpu" && (
        <MatrixRainWebGPU
          rain={{ fontSize, density }}
          paused={paused}
          onError={() => setWebgpuFailed(true)}
        />
      )}
      {mode === "fallback" && (
        <Matrix2DCanvas fontSize={fontSize} density={density} paused={paused} />
      )}
    </div>
  );
};

export const MatrixRain = memo(MatrixRainRenderer);
