"use client";

import { useMotionStore } from "@/components/design-system/hooks/use-motion-store";
import { StateStore } from "@/types/component-store";

interface MotionDivState {
    motionEnabled: boolean;
}

export const useMotionDivStore = (): StateStore<MotionDivState> => {
    const motionEnabled = useMotionStore();
    return { state: { motionEnabled } };
};
