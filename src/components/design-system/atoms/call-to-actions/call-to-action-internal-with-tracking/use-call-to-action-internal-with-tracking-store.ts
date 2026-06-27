"use client";

import type { EffectsStore } from "@/types/component-store";

type CallToActionInternalWithTrackingEffects = {
    onTrack: () => void;
};

export const useCallToActionInternalWithTrackingStore = (
    onClick?: () => void,
): EffectsStore<CallToActionInternalWithTrackingEffects> => {
    return {
        effects: {
            onTrack: onClick ?? (() => {}),
        },
    };
};
