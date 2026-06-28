"use client";

import { openCommandPalette } from "@/components/design-system/state/command-palette/command-palette-events";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { ScrollDirection, useScrollDirection } from "@/components/design-system/hooks/use-scroll-direction";
import { useOsModifierKey, OsModifierKey } from "@/components/design-system/hooks/use-os-modifier-key";
import type { ComponentStore } from "@/types/component-store";

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
    onClickHome: () => void;
    onClickBlog: () => void;
    onClickDsaRoadmap: () => void;
    onClickDsaExercises: () => void;
    onClickChat: () => void;
    onClickMcp: () => void;
    onClickMatrixRain: () => void;
    onClickAboutMe: () => void;
    onClickArt: () => void;
    onClickVideogames: () => void;
    onClickContact: () => void;
}

export interface MenuTrackingCallbacks {
    onTrackHome?: () => void;
    onTrackBlog?: () => void;
    onTrackDsaRoadmap?: () => void;
    onTrackDsaExercises?: () => void;
    onTrackChat?: () => void;
    onTrackMcp?: () => void;
    onTrackMatrixRain?: () => void;
    onTrackAboutMe?: () => void;
    onTrackArt?: () => void;
    onTrackVideogames?: () => void;
    onTrackContact?: () => void;
}

export const useMenuStore = (
    chatSlug: string,
    onPaletteTrigger?: () => void,
    tracking?: MenuTrackingCallbacks,
): ComponentStore<MenuState, MenuEffects> => {
    const pathname = usePathname();
    const direction = useScrollDirection();
    const [shouldOpenMenu, setShouldOpenMenu] = useState(false);
    const modifierKey = useOsModifierKey();
    const shouldHideMenu = pathname === chatSlug ? false : direction === ScrollDirection.down;

    const openMenu = useCallback(() => setShouldOpenMenu(true), []);
    const closeMenu = useCallback(() => setShouldOpenMenu(false), []);

    const handlePaletteTrigger = useCallback(() => {
        onPaletteTrigger?.();
        openCommandPalette();
    }, [onPaletteTrigger]);

    const onClickHome = useCallback(() => {
        tracking?.onTrackHome?.();
        closeMenu();
    }, [tracking, closeMenu]);

    const onClickBlog = useCallback(() => {
        tracking?.onTrackBlog?.();
        closeMenu();
    }, [tracking, closeMenu]);

    const onClickDsaRoadmap = useCallback(() => {
        tracking?.onTrackDsaRoadmap?.();
        closeMenu();
    }, [tracking, closeMenu]);

    const onClickDsaExercises = useCallback(() => {
        tracking?.onTrackDsaExercises?.();
        closeMenu();
    }, [tracking, closeMenu]);

    const onClickChat = useCallback(() => {
        tracking?.onTrackChat?.();
        closeMenu();
    }, [tracking, closeMenu]);

    const onClickMcp = useCallback(() => {
        tracking?.onTrackMcp?.();
        closeMenu();
    }, [tracking, closeMenu]);

    const onClickMatrixRain = useCallback(() => {
        tracking?.onTrackMatrixRain?.();
        closeMenu();
    }, [tracking, closeMenu]);

    const onClickAboutMe = useCallback(() => {
        tracking?.onTrackAboutMe?.();
        closeMenu();
    }, [tracking, closeMenu]);

    const onClickArt = useCallback(() => {
        tracking?.onTrackArt?.();
        closeMenu();
    }, [tracking, closeMenu]);

    const onClickVideogames = useCallback(() => {
        tracking?.onTrackVideogames?.();
        closeMenu();
    }, [tracking, closeMenu]);

    const onClickContact = useCallback(() => {
        tracking?.onTrackContact?.();
        closeMenu();
    }, [tracking, closeMenu]);

    return {
        state: { pathname, shouldHideMenu, shouldOpenMenu, modifierKey },
        effects: {
            openMenu,
            closeMenu,
            handlePaletteTrigger,
            onClickHome,
            onClickBlog,
            onClickDsaRoadmap,
            onClickDsaExercises,
            onClickChat,
            onClickMcp,
            onClickMatrixRain,
            onClickAboutMe,
            onClickArt,
            onClickVideogames,
            onClickContact,
        },
    };
};
