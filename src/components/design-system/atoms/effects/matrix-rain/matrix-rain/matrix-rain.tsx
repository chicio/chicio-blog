"use client";

import { MatrixRainWebGPU } from "matrix-rain-webgpu";
import React, { memo } from "react";
import { Matrix2DCanvas } from "./matrix-2d-canvas";
import { useMatrixRainStore } from "./use-matrix-rain-store";

const backgroundColor = `#00110010`;

const MatrixRainRenderer: React.FC = () => {
    const { state, effects } = useMatrixRainStore();
    const { paused, webGpuSupported, webGpuFailed, settings, rain, bloom, crt } = state;
    const { setContainerEl, onWebGpuError } = effects;

    const showWebGpu = webGpuSupported === true && !webGpuFailed;
    const showFallback = webGpuSupported === false || webGpuFailed;

    return (
        <div
            ref={setContainerEl}
            className="pointer-events-none absolute top-0 left-0 h-full w-full"
            style={{ backgroundColor }}
        >
            {showWebGpu && (
                <MatrixRainWebGPU
                    paused={paused}
                    rain={rain}
                    bloom={bloom}
                    crt={crt}
                    onError={onWebGpuError}
                />
            )}
            {showFallback && (
                <Matrix2DCanvas fontSize={settings.rain.fontSize} density={settings.rain.density} paused={paused} />
            )}
        </div>
    );
};

export const MatrixRain = memo(MatrixRainRenderer);
