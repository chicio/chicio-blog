"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import { triggerRevealAllSolutions } from "@/lib/content/easter-eggs/reveal-all-signal";
import { EASTER_EGG_SLUGS } from "@/lib/easter-eggs/easter-egg-catalog";
import { readFoundEasterEggs, resetFoundEasterEggs, subscribeToEasterEggFound } from "@/lib/easter-eggs/easter-egg-found";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { ComponentStore } from "@/types/component-store";

interface EggHuntProgressState {
    foundCount: number;
    totalCount: number;
    percentage: number;
    shouldReduceMotion: boolean;
}

interface EggHuntProgressEffects {
    resetHunt: () => void;
    revealAll: () => void;
}

const getServerFoundCountSnapshot = (): number => 0;

export const useEggHuntProgressStore = (): ComponentStore<EggHuntProgressState, EggHuntProgressEffects> => {
    const shouldReduceMotion = useReducedMotions();
    const foundCount = useSyncExternalStore(
        subscribeToEasterEggFound,
        () => readFoundEasterEggs().length,
        getServerFoundCountSnapshot,
    );
    const totalCount = EASTER_EGG_SLUGS.length;
    const percentage = Math.round((foundCount / totalCount) * 100);

    const resetHunt = useCallback(() => {
        resetFoundEasterEggs();
        trackWith({
            category: tracking.category.easter_egg_hunt,
            label: tracking.label.body,
            action: tracking.action.easter_egg_hunt_reset,
        });
    }, []);

    const revealAll = useCallback(() => {
        triggerRevealAllSolutions();
        trackWith({
            category: tracking.category.easter_egg_hunt,
            label: tracking.label.body,
            action: tracking.action.easter_egg_hunt_reveal_all,
        });
    }, []);

    return {
        state: { foundCount, totalCount, percentage, shouldReduceMotion },
        effects: { resetHunt, revealAll },
    };
};
