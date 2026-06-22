"use client";

import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import { StateStore } from "@/types/component-store";

type PillsState = {
    shouldReduceMotion: boolean;
};

export const usePillsStore = (): StateStore<PillsState> => {
    const shouldReduceMotion = useReducedMotions();

    return {
        state: { shouldReduceMotion },
    };
};
