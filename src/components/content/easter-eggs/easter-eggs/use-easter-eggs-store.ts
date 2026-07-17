"use client";

import { useCallback, useState } from "react";
import { easterEggHints, easterEggHuntIntroLines } from "@/lib/content/easter-eggs/easter-eggs-content";
import type { EasterEggHint } from "@/lib/content/easter-eggs/easter-eggs-content";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { ComponentStore } from "@/types/component-store";

interface EasterEggsState {
    introLines: string[];
    hints: EasterEggHint[];
    revealedIds: Set<string>;
}

interface EasterEggsEffects {
    toggleReveal: (id: string) => () => void;
}

export const useEasterEggsStore = (): ComponentStore<EasterEggsState, EasterEggsEffects> => {
    const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

    const toggleReveal = useCallback(
        (id: string) => () => {
            setRevealedIds((prev) => {
                const next = new Set(prev);
                if (next.has(id)) {
                    next.delete(id);
                } else {
                    next.add(id);
                    trackWith({
                        category: tracking.category.easter_egg_hunt,
                        label: id,
                        action: tracking.action.easter_egg_hunt_reveal_hint,
                    });
                }
                return next;
            });
        },
        [],
    );

    return {
        state: {
            introLines: easterEggHuntIntroLines,
            hints: easterEggHints,
            revealedIds,
        },
        effects: { toggleReveal },
    };
};
