"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { useWebGpuSupported } from "@/components/design-system/hooks/use-webgpu-supported";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import { openMatrixRainPanel } from "@/components/design-system/state/command-palette/command-palette-events";
import { ComponentStore } from "@/types/component-store";

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

    const handleSelect = () => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_open_matrix_rain_panel,
        });
        onClose();
        openMatrixRainPanel();
    };

    return {
        state: { visible },
        effects: { handleSelect },
    };
};
