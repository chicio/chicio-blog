"use client";

import { EffectsStore } from "@/types/component-store";

interface PageIndicatorButtonEffects {
    handleClick: (e: React.MouseEvent) => void;
}

export const usePageIndicatorButtonStore = (
    index: number,
    onSelect: (index: number) => void,
): EffectsStore<PageIndicatorButtonEffects> => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(index);
    };

    return {
        effects: { handleClick },
    };
};
