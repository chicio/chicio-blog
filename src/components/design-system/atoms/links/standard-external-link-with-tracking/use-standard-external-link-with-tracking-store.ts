"use client";

import type { EffectsStore } from "@/types/component-store";

type StandardExternalLinkWithTrackingEffects = {
    onTrack: () => void;
};

export const useStandardExternalLinkWithTrackingStore = (
    onClick?: () => void,
): EffectsStore<StandardExternalLinkWithTrackingEffects> => {
    return {
        effects: {
            onTrack: onClick ?? (() => {}),
        },
    };
};
