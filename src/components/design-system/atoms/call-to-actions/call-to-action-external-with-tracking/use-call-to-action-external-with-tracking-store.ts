"use client";

import type { EffectsStore } from "@/types/component-store";

type CallToActionExternalWithTrackingEffects = {
    onTrack: () => void;
};

export const useCallToActionExternalWithTrackingStore = (
    onClick?: () => void,
): EffectsStore<CallToActionExternalWithTrackingEffects> => {
    return {
        effects: {
            onTrack: onClick ?? (() => {}),
        },
    };
};
