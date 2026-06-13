"use client";

import { MatrixRainWebGPU } from "matrix-rain-webgpu";
import React, { memo, useRef, useState } from "react";
import { Matrix2DCanvas } from "./matrix-2d-canvas";
import { useMatrixRainActivity } from "./use-matrix-rain-activity";
import { useWebGpuSupported } from "../../../utils/hooks/use-webgpu-supported";

const backgroundColor = `#00110010`;

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
  // null until the client resolves it (server/hydration) → neither renderer
  // mounts yet, just the backdrop, so there's no 2D→WebGPU swap.
  const webGpuSupported = useWebGpuSupported();
  // Runtime safety net for "WebGPU present but adapter/init fails".
  const [webGpuFailed, setWebGpuFailed] = useState(false);

  const showWebGpu = webGpuSupported === true && !webGpuFailed;
  const showFallback = webGpuSupported === false || webGpuFailed;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute top-0 left-0 h-full w-full"
      style={{ backgroundColor }}
    >
      {showWebGpu && (
        <MatrixRainWebGPU
          rain={{ fontSize, density }}
          paused={paused}
          onError={() => setWebGpuFailed(true)}
        />
      )}
      {showFallback && (
        <Matrix2DCanvas fontSize={fontSize} density={density} paused={paused} />
      )}
    </div>
  );
};

export const MatrixRain = memo(MatrixRainRenderer);
