"use client";

import { MatrixRainWebGPU } from "matrix-rain-webgpu";
import React, { memo, useRef, useState } from "react";
import { Matrix2DCanvas } from "./matrix-2d-canvas";
import { useMatrixRainActivity } from "./use-matrix-rain-activity";
import { useWebGpuSupported } from "../../../utils/hooks/use-webgpu-supported";
import { useMatrixSettingsStore } from "../../../utils/hooks/use-matrix-settings-store";
import { settingsToProps } from "@/lib/matrix-settings/matrix-settings";

const backgroundColor = `#00110010`;

const MatrixRainRenderer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const paused = useMatrixRainActivity(containerRef);
    const webGpuSupported = useWebGpuSupported();
    const [webGpuFailed, setWebGpuFailed] = useState(false);
    const settings = useMatrixSettingsStore();
    const { rain, bloom, crt } = settingsToProps(settings);

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
                    paused={paused}
                    rain={rain}
                    bloom={bloom}
                    crt={crt}
                    onError={() => setWebGpuFailed(true)}
                />
            )}
            {showFallback && (
                <Matrix2DCanvas fontSize={settings.rain.fontSize} density={settings.rain.density} paused={paused} />
            )}
        </div>
    );
};

export const MatrixRain = memo(MatrixRainRenderer);
