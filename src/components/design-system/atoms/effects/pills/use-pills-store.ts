"use client";

import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";

type PillsState = {
    shouldReduceMotion: boolean;
};

export const usePillsStore = (): { state: PillsState; effects: Record<string, never> } => {
    const shouldReduceMotion = useReducedMotions();

    return {
        state: { shouldReduceMotion },
        effects: {},
    };
};
