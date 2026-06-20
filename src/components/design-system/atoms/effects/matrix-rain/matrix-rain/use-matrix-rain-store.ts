"use client";

import { useRef, useState } from "react";
import { useMatrixRainActivity } from "./use-matrix-rain-activity";
import { useWebGpuSupported } from "@/components/design-system/hooks/use-webgpu-supported";
import { useMatrixSettingsStore } from "@/components/design-system/hooks/use-matrix-settings-store";
import { settingsToProps } from "@/lib/matrix-settings/matrix-settings";

type MatrixRainState = {
    paused: boolean;
    webGpuSupported: boolean | null;
    webGpuFailed: boolean;
    settings: ReturnType<typeof useMatrixSettingsStore>;
    rain: ReturnType<typeof settingsToProps>["rain"];
    bloom: ReturnType<typeof settingsToProps>["bloom"];
    crt: ReturnType<typeof settingsToProps>["crt"];
};

type MatrixRainEffects = {
    setContainerEl: (el: HTMLDivElement | null) => void;
    onWebGpuError: () => void;
};

export const useMatrixRainStore = (): { state: MatrixRainState; effects: MatrixRainEffects } => {
    const [, setContainerEl] = useState<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLElement | null>(null);
    const [webGpuFailed, setWebGpuFailed] = useState(false);
    const webGpuSupported = useWebGpuSupported();
    const settings = useMatrixSettingsStore();
    const { rain, bloom, crt } = settingsToProps(settings);

    const handleSetContainerEl = (el: HTMLDivElement | null) => {
        containerRef.current = el;
        setContainerEl(el);
    };

    const paused = useMatrixRainActivity(containerRef);

    const onWebGpuError = () => setWebGpuFailed(true);

    return {
        state: {
            paused,
            webGpuSupported,
            webGpuFailed,
            settings,
            rain,
            bloom,
            crt,
        },
        effects: {
            setContainerEl: handleSetContainerEl,
            onWebGpuError,
        },
    };
};
