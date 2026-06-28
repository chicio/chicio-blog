"use client";

import type { EffectsStore } from "@/types/component-store";

interface MenuItemEffects {
    handleClick: (onClick?: () => void) => () => void;
}

export const useMenuItemStore = (): EffectsStore<MenuItemEffects> => {
    const handleClick = (onClick?: () => void) => () => {
        onClick?.();
    };

    return { effects: { handleClick } };
};
