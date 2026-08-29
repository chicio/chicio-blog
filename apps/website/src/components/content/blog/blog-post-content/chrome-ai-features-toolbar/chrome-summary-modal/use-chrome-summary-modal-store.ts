"use client";

import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import { ComponentStore } from "@/types/component-store";
import React from "react";

interface ChromeSummaryModalState {
    shouldReduceMotion: boolean;
}

interface ChromeSummaryModalEffects {
    stopPropagation: (e: React.MouseEvent) => void;
}

export const useChromeSummaryModalStore = (): ComponentStore<ChromeSummaryModalState, ChromeSummaryModalEffects> => {
    const shouldReduceMotion = useReducedMotions();

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return {
        state: { shouldReduceMotion },
        effects: { stopPropagation },
    };
};
