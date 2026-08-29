"use client";

import type { EffectsStore } from "matrix-component-store";

interface MenuItemEffects {
    handleClick: (onClick?: () => void) => () => void;
}

export const useMenuItemStore = (): EffectsStore<MenuItemEffects> => {
    const handleClick = (onClick?: () => void) => () => {
        onClick?.();
    };

    return { effects: { handleClick } };
};
