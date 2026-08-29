"use client";

import { useMotionStore } from "../../../hooks/use-motion-store";
import type { StateStore } from "matrix-component-store";

interface MotionDivState {
    motionEnabled: boolean;
}

export const useMotionDivStore = (): StateStore<MotionDivState> => {
    const motionEnabled = useMotionStore();
    return { state: { motionEnabled } };
};
