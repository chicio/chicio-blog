"use client";

import { EffectsStore } from "@/types/component-store";

type StandardInternalLinkWithTrackingEffects = {
    onTrack: () => void;
};

export const useStandardInternalLinkWithTrackingStore = (
    onClick?: () => void,
): EffectsStore<StandardInternalLinkWithTrackingEffects> => {
    return {
        effects: {
            onTrack: onClick ?? (() => {}),
        },
    };
};
