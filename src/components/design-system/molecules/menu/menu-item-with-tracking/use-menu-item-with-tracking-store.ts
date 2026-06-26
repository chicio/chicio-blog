"use client";

import { EffectsStore } from "@/types/component-store";

interface MenuItemWithTrackingEffects {
    handleClick: (onClick?: () => void, onClickCallback?: () => void) => () => void;
}

export const useMenuItemWithTrackingStore = (): EffectsStore<MenuItemWithTrackingEffects> => {
    const handleClick = (onClick?: () => void, onClickCallback?: () => void) => () => {
        onClick?.();
        onClickCallback?.();
    };

    return { effects: { handleClick } };
};
