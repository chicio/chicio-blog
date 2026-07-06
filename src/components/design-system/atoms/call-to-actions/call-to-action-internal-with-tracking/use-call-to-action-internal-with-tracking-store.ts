"use client";

import type { EffectsStore } from "@/types/component-store";
import { useTrackingCallback } from "@/components/design-system/hooks/use-tracking-callback";

type CallToActionInternalWithTrackingEffects = {
    onTrack: () => void;
};

export const useCallToActionInternalWithTrackingStore = (
    onClick?: () => void,
): EffectsStore<CallToActionInternalWithTrackingEffects> => {
    return {
        effects: {
            onTrack: useTrackingCallback(onClick),
        },
    };
};
