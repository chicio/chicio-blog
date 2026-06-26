"use client";

import { openCommandPalette } from "@/components/design-system/state/command-palette/command-palette-events";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
}

export const useMenuStore = (trackingCategory: string): ComponentStore<MenuState, MenuEffects> => {
    const pathname = usePathname();
    const direction = useScrollDirection();
    const [shouldOpenMenu, setShouldOpenMenu] = useState(false);
    const modifierKey = useOsModifierKey();
    const shouldHideMenu = pathname === slugs.chat ? false : direction === ScrollDirection.down;

    const openMenu = () => setShouldOpenMenu(true);
    const closeMenu = () => setShouldOpenMenu(false);

    const handlePaletteTrigger = () => {
        trackWith({
            category: trackingCategory,
            label: tracking.label.header,
            action: tracking.action.command_palette_open,
        });
        openCommandPalette();
    };

    return {
        state: { pathname, shouldHideMenu, shouldOpenMenu, modifierKey },
        effects: { openMenu, closeMenu, handlePaletteTrigger },
    };
};
