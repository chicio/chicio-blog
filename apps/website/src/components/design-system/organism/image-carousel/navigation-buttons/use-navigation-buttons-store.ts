"use client";

import type { EffectsStore } from "@/types/component-store";

interface NavigationButtonsEffects {
    handlePrevious: (e: React.MouseEvent) => void;
    handleNext: (e: React.MouseEvent) => void;
}

export const useNavigationButtonsStore = (
    onPrevious: () => void,
    onNext: () => void,
    stopPropagation: boolean,
): EffectsStore<NavigationButtonsEffects> => {
    const handlePrevious = (e: React.MouseEvent) => {
        if (stopPropagation) { e.stopPropagation(); }
        onPrevious();
    };

    const handleNext = (e: React.MouseEvent) => {
        if (stopPropagation) { e.stopPropagation(); }
        onNext();
    };

    return {
        effects: { handlePrevious, handleNext },
    };
};
