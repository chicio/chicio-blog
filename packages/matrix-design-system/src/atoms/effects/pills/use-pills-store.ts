"use client";

import { useReducedMotions } from "../../../hooks/use-reduced-motions";
import type { StateStore } from "matrix-component-store";

type PillsState = {
    shouldReduceMotion: boolean;
};

export const usePillsStore = (): StateStore<PillsState> => {
    const shouldReduceMotion = useReducedMotions();

    return {
        state: { shouldReduceMotion },
    };
};
