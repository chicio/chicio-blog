"use client";

import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import { ComponentStore } from "@/types/component-store";

interface ChromeSummaryModalState {
    shouldReduceMotion: boolean;
}

export const useChromeSummaryModalStore = (): ComponentStore<ChromeSummaryModalState, Record<string, never>> => {
    const shouldReduceMotion = useReducedMotions();

    return {
        state: { shouldReduceMotion },
        effects: {},
    };
};
