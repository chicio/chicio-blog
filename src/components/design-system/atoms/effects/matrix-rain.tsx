"use client";

import { MatrixRainWebGPU, isWebGPUSupported } from "matrix-rain-webgpu";
import React, { memo, useEffect, useRef, useState } from "react";
import { Matrix2DCanvas } from "./matrix-2d-canvas";
import { useMatrixRainActivity } from "./use-matrix-rain-activity";

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
  const [mode, setMode] = useState<"pending" | "webgpu" | "fallback">(
    "pending",
  );

  useEffect(() => {
    setMode(isWebGPUSupported() ? "webgpu" : "fallback");
  }, []);

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
          onError={() => setMode("fallback")}
        />
      )}
      {mode === "fallback" && (
        <Matrix2DCanvas fontSize={fontSize} density={density} paused={paused} />
      )}
    </div>
  );
};

export const MatrixRain = memo(MatrixRainRenderer);
