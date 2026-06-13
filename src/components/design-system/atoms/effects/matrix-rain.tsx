"use client";

import { MatrixRainWebGPU, isWebGPUSupported } from "matrix-rain-webgpu";
import React, { memo, useEffect, useRef, useState } from "react";
import { Matrix2DCanvas } from "./matrix-2d-canvas";
import { useMatrixRainActivity } from "./use-matrix-rain-activity";

// Matches the 2D backdrop; painted on the container so the brief client-side
// WebGPU-detection gap is never a blank/white flash.
const backgroundColor = `#00110010`;

interface MatrixRainProps {
  fontSize?: number;
  density?: number;
}

// Orchestrator: keeps the public `MatrixRain` name + {fontSize, density} shape
// so every existing call site is untouched. Detects WebGPU once on mount and
// renders EITHER the published WebGPU effect (full showcase: bloom/CRT/parallax
// defaults) OR the 2D fallback — never both. `onError` is the runtime safety
// net for "WebGPU present but adapter/init fails" (and can fire post-paint).
// A single `paused` signal drives whichever renderer is active.
const MatrixRainRenderer: React.FC<MatrixRainProps> = ({
  fontSize = 16,
  density = 0.95,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const paused = useMatrixRainActivity(containerRef);
  // Literal initial state (no navigator access during render) → server and
  // first client paint both emit the 'pending' backdrop, so no hydration
  // mismatch. Capability detection happens in the effect below.
  const [mode, setMode] = useState<"pending" | "webgpu" | "fallback">(
    "pending",
  );

  useEffect(() => {
    // One-time client-side capability detection. It must run after mount (not
    // during render) because `isWebGPUSupported` touches `navigator`, which is
    // absent during SSR; the single 'pending' → 'webgpu'/'fallback' transition
    // is intentional (approach: render a neutral backdrop, then pick once — no
    // 2D→WebGPU swap). This is a legitimate exception to "no setState in effect".
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
