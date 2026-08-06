"use client";

import { useSyncExternalStore } from "react";
import type { EasterEggSlug } from "@/lib/easter-eggs/easter-egg-catalog";
import { isEasterEggFound, subscribeToEasterEggFound } from "@/lib/easter-eggs/easter-egg-found";
import type { StateStore } from "@/types/component-store";

interface EggCardState {
    found: boolean;
}

const getServerFoundSnapshot = (): boolean => false;

/**
 * Only the badge and the border need the found state here — the replay button lives in `EggSolution`
 * so that it can share a row with the reveal toggle, and reads the same global store itself.
 */
export const useEggCardStore = (slug: EasterEggSlug): StateStore<EggCardState> => {
    const found = useSyncExternalStore(
        subscribeToEasterEggFound,
        () => isEasterEggFound(slug),
        getServerFoundSnapshot,
    );

    return { state: { found } };
};
