"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { subscribeToRevealAllSolutions } from "@/lib/content/easter-eggs/reveal-all-signal";
import type { EasterEggSlug } from "@/lib/easter-eggs/easter-egg-catalog";
import { isEasterEggFound, subscribeToEasterEggFound } from "@/lib/easter-eggs/easter-egg-found";
import { openEasterEgg } from "@/lib/easter-eggs/easter-egg-overlay-state";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { ComponentStore } from "@/types/component-store";

interface EggSolutionState {
    revealed: boolean;
    found: boolean;
}

interface EggSolutionEffects {
    toggleReveal: () => void;
    replay: () => void;
}

const getServerFoundSnapshot = (): boolean => false;

/**
 * The tracking label keeps the underscored form the `easter_egg_hunt_reveal_hint` action has always
 * been recorded with, so this reads as the same series in analytics even though the component now
 * takes the hyphenated slug — which is the typed identifier everything else in the feature uses.
 */
const trackingLabelFor = (slug: EasterEggSlug) => slug.replace(/-/g, "_");

export const useEggSolutionStore = (slug: EasterEggSlug): ComponentStore<EggSolutionState, EggSolutionEffects> => {
    const [revealed, setRevealed] = useState(false);
    const found = useSyncExternalStore(
        subscribeToEasterEggFound,
        () => isEasterEggFound(slug),
        getServerFoundSnapshot,
    );

    useEffect(() => {
        const handleRevealAll = () => setRevealed(true);
        return subscribeToRevealAllSolutions(handleRevealAll);
    }, []);

    const toggleReveal = useCallback(() => {
        setRevealed((wasRevealed) => {
            if (!wasRevealed) {
                trackWith({
                    category: tracking.category.easter_egg_hunt,
                    label: trackingLabelFor(slug),
                    action: tracking.action.easter_egg_hunt_reveal_hint,
                });
            }

            return !wasRevealed;
        });
    }, [slug]);

    // Calls openEasterEgg directly rather than triggerEasterEgg on purpose: this egg is already
    // found (that's the only way the replay button renders at all), so it must not re-run
    // markEasterEggFound/tracking, and it must not be blocked by triggerEasterEgg's
    // "already open" guard either. Do not "simplify" this to triggerEasterEgg(slug).
    const replay = useCallback(() => {
        openEasterEgg(slug);
    }, [slug]);

    return {
        state: { revealed, found },
        effects: { toggleReveal, replay },
    };
};
