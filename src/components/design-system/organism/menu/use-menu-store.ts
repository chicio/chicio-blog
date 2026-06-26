"use client";

import { openCommandPalette } from "@/components/design-system/state/command-palette/command-palette-events";
import { tracking } from "@/types/configuration/tracking";
import { usePathname } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import { ScrollDirection, useScrollDirection } from "@/components/design-system/hooks/use-scroll-direction";
import { useOsModifierKey, OsModifierKey } from "@/components/design-system/hooks/use-os-modifier-key";
import { slugs } from "@/types/configuration/slug";
import { ComponentStore } from "@/types/component-store";

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

export const useMenuStore = (
    onPaletteTrigger?: () => void,
    onTrackNavigation?: (action: string) => void,
): ComponentStore<MenuState, MenuEffects> => {
    const pathname = usePathname();
    const direction = useScrollDirection();
    const [shouldOpenMenu, setShouldOpenMenu] = useState(false);
    const modifierKey = useOsModifierKey();
    const shouldHideMenu = pathname === slugs.chat ? false : direction === ScrollDirection.down;

    const openMenu = useCallback(() => setShouldOpenMenu(true), []);
    const closeMenu = useCallback(() => setShouldOpenMenu(false), []);

    const handlePaletteTrigger = useCallback(() => {
        onPaletteTrigger?.();
        openCommandPalette();
    }, [onPaletteTrigger]);

    const onTrackHome = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_home) : undefined),
        [onTrackNavigation],
    );
    const onTrackBlog = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_blog) : undefined),
        [onTrackNavigation],
    );
    const onTrackDsaRoadmap = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_dsa_roadmap) : undefined),
        [onTrackNavigation],
    );
    const onTrackDsaExercises = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_dsa_exercises) : undefined),
        [onTrackNavigation],
    );
    const onTrackChat = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_chat) : undefined),
        [onTrackNavigation],
    );
    const onTrackMcp = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_mcp) : undefined),
        [onTrackNavigation],
    );
    const onTrackMatrixRain = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_matrix_rain_webgpu) : undefined),
        [onTrackNavigation],
    );
    const onTrackAboutMe = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_about_me) : undefined),
        [onTrackNavigation],
    );
    const onTrackArt = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_art) : undefined),
        [onTrackNavigation],
    );
    const onTrackVideogames = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_videogame_collection) : undefined),
        [onTrackNavigation],
    );
    const onTrackContact = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_contact) : undefined),
        [onTrackNavigation],
    );

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
