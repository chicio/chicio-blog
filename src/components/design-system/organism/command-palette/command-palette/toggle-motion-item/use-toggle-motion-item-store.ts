"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { useMotionStore } from "@/components/design-system/hooks/use-motion-store";
import { writeMotion } from "@/lib/motion/motion";
import { ComponentStore } from "@/types/component-store";

interface ToggleMotionItemState {
    motionEnabled: boolean;
}

interface ToggleMotionItemEffects {
    handleToggleMotion: () => void;
}

export const useToggleMotionItemStore = (): ComponentStore<ToggleMotionItemState, ToggleMotionItemEffects> => {
    const motionEnabled = useMotionStore();

    const handleToggleMotion = () => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_toggle_motion,
        });
        writeMotion(motionEnabled ? "off" : "on");
    };

    return {
        state: { motionEnabled },
        effects: { handleToggleMotion },
    };
};
