"use client";

import type { EffectsStore } from "@/types/component-store";
import { useTrackingCallback } from "@/components/design-system/hooks/use-tracking-callback";

type CallToActionExternalWithTrackingEffects = {
    onTrack: () => void;
};

export const useCallToActionExternalWithTrackingStore = (
    onClick?: () => void,
): EffectsStore<CallToActionExternalWithTrackingEffects> => {
    return {
        effects: {
            onTrack: useTrackingCallback(onClick),
        },
    };
};
