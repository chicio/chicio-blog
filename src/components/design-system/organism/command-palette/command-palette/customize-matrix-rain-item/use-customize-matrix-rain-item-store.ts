"use client";

import { useWebGpuSupported } from "@/components/design-system/hooks/use-webgpu-supported";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import { openMatrixRainPanel } from "@/components/design-system/state/command-palette/command-palette-events";
import type { ComponentStore } from "@/types/component-store";
import { useCallback } from "react";

interface CustomizeMatrixRainItemState {
    visible: boolean;
}

interface CustomizeMatrixRainItemEffects {
    handleSelect: () => void;
}

export const useCustomizeMatrixRainItemStore = (
    onClose: () => void,
): ComponentStore<CustomizeMatrixRainItemState, CustomizeMatrixRainItemEffects> => {
    const webGpuSupported = useWebGpuSupported();
    const reducedMotion = useReducedMotions();
    const visible = webGpuSupported === true && !reducedMotion;

    const handleSelect = useCallback(() => {
        onClose();
        openMatrixRainPanel();
    }, [onClose]);

    return {
        state: { visible },
        effects: { handleSelect },
    };
};
