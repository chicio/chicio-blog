"use client";

import { useCallback, useState } from "react";
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
