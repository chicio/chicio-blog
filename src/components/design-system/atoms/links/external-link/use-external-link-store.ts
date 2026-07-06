"use client";

import type { EffectsStore } from "@/types/component-store";
import { useTrackingCallback } from "@/components/design-system/hooks/use-tracking-callback";

type ExternalLinkEffects = {
    onTrack: () => void;
};

export const useExternalLinkStore = (
    onClick?: () => void,
): EffectsStore<ExternalLinkEffects> => {
    return {
        effects: {
            onTrack: useTrackingCallback(onClick),
        },
    };
};
