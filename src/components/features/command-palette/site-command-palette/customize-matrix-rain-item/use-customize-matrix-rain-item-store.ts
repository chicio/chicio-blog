"use client";

import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import { useWebGpuSupported } from "@/components/design-system/hooks/use-webgpu-supported";
import { openMatrixRainPanel } from "@/lib/matrix-rain/matrix-rain-panel-events";
import type { ComponentStore } from "@/types/component-store";
import { useCallback } from "react";

interface CustomizeMatrixRainItemState {
    visible: boolean;
}

interface CustomizeMatrixRainItemEffects {
    handleSelect: () => void;
}

export const useCustomizeMatrixRainItemStore = (
    onTrack?: () => void,
): ComponentStore<CustomizeMatrixRainItemState, CustomizeMatrixRainItemEffects> => {
    const webGpuSupported = useWebGpuSupported();
    const reducedMotion = useReducedMotions();
    const visible = webGpuSupported === true && !reducedMotion;

    const handleSelect = useCallback(() => {
        onTrack?.();
        openMatrixRainPanel();
    }, [onTrack]);

    return {
        state: { visible },
        effects: { handleSelect },
    };
};
