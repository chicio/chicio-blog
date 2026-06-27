"use client";

import type { EffectsStore } from "@/types/component-store";

type InternalLinkEffects = {
    onTrack: () => void;
};

export const useInternalLinkStore = (
    onClick?: () => void,
): EffectsStore<InternalLinkEffects> => {
    return {
        effects: {
            onTrack: onClick ?? (() => {}),
        },
    };
};
