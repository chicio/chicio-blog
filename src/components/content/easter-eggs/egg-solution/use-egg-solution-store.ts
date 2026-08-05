"use client";

import { useCallback, useEffect, useState } from "react";
import { subscribeToRevealAllSolutions } from "@/lib/content/easter-eggs/reveal-all-signal";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { ComponentStore } from "@/types/component-store";

interface EggSolutionState {
    revealed: boolean;
}

interface EggSolutionEffects {
    toggleReveal: () => void;
}

export const useEggSolutionStore = (eggId: string): ComponentStore<EggSolutionState, EggSolutionEffects> => {
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const handleRevealAll = () => setRevealed(true);
        return subscribeToRevealAllSolutions(handleRevealAll);
    }, []);

    const toggleReveal = useCallback(() => {
        setRevealed((wasRevealed) => {
            if (!wasRevealed) {
                trackWith({
                    category: tracking.category.easter_egg_hunt,
                    label: eggId,
                    action: tracking.action.easter_egg_hunt_reveal_hint,
                });
            }

            return !wasRevealed;
        });
    }, [eggId]);

    return {
        state: { revealed },
        effects: { toggleReveal },
    };
};
