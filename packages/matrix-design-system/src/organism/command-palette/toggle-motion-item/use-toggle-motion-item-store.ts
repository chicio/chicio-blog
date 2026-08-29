"use client";

import { useMotionStore } from "../../../hooks/use-motion-store";
import { writeMotion } from "../../../state/motion/motion";
import type { ComponentStore } from "matrix-component-store";
import { useCallback } from "react";

interface ToggleMotionItemState {
    motionEnabled: boolean;
}

interface ToggleMotionItemEffects {
    handleToggleMotion: () => void;
}

export const useToggleMotionItemStore = (
    onTrack?: () => void,
): ComponentStore<ToggleMotionItemState, ToggleMotionItemEffects> => {
    const motionEnabled = useMotionStore();

    const handleToggleMotion = useCallback(() => {
        onTrack?.();
        writeMotion(motionEnabled ? "off" : "on");
    }, [onTrack, motionEnabled]);

    return {
        state: { motionEnabled },
        effects: { handleToggleMotion },
    };
};
