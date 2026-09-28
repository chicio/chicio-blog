"use client";

import { openCommandPalette } from "../../state/command-palette/command-palette-events";
import { useState, useCallback } from "react";
import { ScrollDirection, useScrollDirection } from "../../hooks/use-scroll-direction";
import { useOsModifierKey, OsModifierKey } from "../../hooks/use-os-modifier-key";
import type { ComponentStore } from "matrix-component-store";

interface SelectableLink {
    to: string;
    external?: boolean;
    activePathPrefixes?: string[];
}

interface MenuState {
    pathname: string;
    shouldHideMenu: boolean;
    shouldOpenMenu: boolean;
    modifierKey: OsModifierKey | null;
}

interface MenuEffects {
    openMenu: () => void;
    closeMenu: () => void;
    handlePaletteTrigger: () => void;
    handleLinkClick: (onClick?: () => void) => () => void;
    isSelected: (link: SelectableLink) => boolean;
}

export const useMenuStore = (
    pathname: string,
    pinnedOnPaths: string[],
    onPaletteTrigger?: () => void,
): ComponentStore<MenuState, MenuEffects> => {
    const direction = useScrollDirection();
    const [shouldOpenMenu, setShouldOpenMenu] = useState(false);
    const modifierKey = useOsModifierKey();
    const shouldHideMenu = pinnedOnPaths.includes(pathname) ? false : direction === ScrollDirection.down;

    const openMenu = useCallback(() => setShouldOpenMenu(true), []);
    const closeMenu = useCallback(() => setShouldOpenMenu(false), []);

    const handlePaletteTrigger = useCallback(() => {
        onPaletteTrigger?.();
        openCommandPalette();
    }, [onPaletteTrigger]);

    const handleLinkClick = useCallback(
        (onClick?: () => void) => () => {
            onClick?.();
            closeMenu();
        },
        [closeMenu],
    );

    const isSelected = useCallback(
        (link: SelectableLink) =>
            !link.external &&
            (link.to === pathname || (link.activePathPrefixes?.some((prefix) => pathname.startsWith(prefix)) ?? false)),
        [pathname],
    );

    return {
        state: { pathname, shouldHideMenu, shouldOpenMenu, modifierKey },
        effects: { openMenu, closeMenu, handlePaletteTrigger, handleLinkClick, isSelected },
    };
};
