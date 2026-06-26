"use client";

import { openCommandPalette } from "@/components/design-system/state/command-palette/command-palette-events";
import { usePathname } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
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
    onTrackHome: (() => void) | undefined;
    onTrackBlog: (() => void) | undefined;
    onTrackDsaRoadmap: (() => void) | undefined;
    onTrackDsaExercises: (() => void) | undefined;
    onTrackChat: (() => void) | undefined;
    onTrackMcp: (() => void) | undefined;
    onTrackMatrixRain: (() => void) | undefined;
    onTrackAboutMe: (() => void) | undefined;
    onTrackArt: (() => void) | undefined;
    onTrackVideogames: (() => void) | undefined;
    onTrackContact: (() => void) | undefined;
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

    const onTrackHome = useMemo(() => tracking?.onTrackHome, [tracking]);
    const onTrackBlog = useMemo(() => tracking?.onTrackBlog, [tracking]);
    const onTrackDsaRoadmap = useMemo(() => tracking?.onTrackDsaRoadmap, [tracking]);
    const onTrackDsaExercises = useMemo(() => tracking?.onTrackDsaExercises, [tracking]);
    const onTrackChat = useMemo(() => tracking?.onTrackChat, [tracking]);
    const onTrackMcp = useMemo(() => tracking?.onTrackMcp, [tracking]);
    const onTrackMatrixRain = useMemo(() => tracking?.onTrackMatrixRain, [tracking]);
    const onTrackAboutMe = useMemo(() => tracking?.onTrackAboutMe, [tracking]);
    const onTrackArt = useMemo(() => tracking?.onTrackArt, [tracking]);
    const onTrackVideogames = useMemo(() => tracking?.onTrackVideogames, [tracking]);
    const onTrackContact = useMemo(() => tracking?.onTrackContact, [tracking]);

    return {
        state: { pathname, shouldHideMenu, shouldOpenMenu, modifierKey },
        effects: {
            openMenu,
            closeMenu,
            handlePaletteTrigger,
            onTrackHome,
            onTrackBlog,
            onTrackDsaRoadmap,
            onTrackDsaExercises,
            onTrackChat,
            onTrackMcp,
            onTrackMatrixRain,
            onTrackAboutMe,
            onTrackArt,
            onTrackVideogames,
            onTrackContact,
        },
    };
};
