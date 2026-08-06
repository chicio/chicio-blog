"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { EasterEggSlug } from "@/lib/easter-eggs/easter-egg-catalog";
import { isEasterEggFound, subscribeToEasterEggFound } from "@/lib/easter-eggs/easter-egg-found";
import { openEasterEgg } from "@/lib/easter-eggs/easter-egg-overlay-state";
import type { ComponentStore } from "@/types/component-store";

interface EggCardState {
    found: boolean;
}

interface EggCardEffects {
    replay: () => void;
}

const getServerFoundSnapshot = (): boolean => false;

export const useEggCardStore = (slug: EasterEggSlug): ComponentStore<EggCardState, EggCardEffects> => {
    const found = useSyncExternalStore(
        subscribeToEasterEggFound,
        () => isEasterEggFound(slug),
        getServerFoundSnapshot,
    );

    // Calls openEasterEgg directly rather than triggerEasterEgg on purpose: this egg is already
    // found (that's the only way the replay button renders at all), so it must not re-run
    // markEasterEggFound/tracking, and it must not be blocked by triggerEasterEgg's
    // "already open" guard either. Do not "simplify" this to triggerEasterEgg(slug).
    const replay = useCallback(() => {
        openEasterEgg(slug);
    }, [slug]);

    return {
        state: { found },
        effects: { replay },
    };
};
