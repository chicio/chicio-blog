"use client";

import type { EffectsStore } from "@/types/component-store";

interface MenuItemEffects {
    handleClick: (onClick?: () => void, onTrack?: () => void) => () => void;
}

export const useMenuItemStore = (): EffectsStore<MenuItemEffects> => {
    const handleClick = (onClick?: () => void, onTrack?: () => void) => () => {
        onTrack?.();
        onClick?.();
    };

    return { effects: { handleClick } };
};
