"use client";

import type { EffectsStore } from "@/types/component-store";
import { useTrackingCallback } from "@/components/design-system/hooks/use-tracking-callback";

type InternalLinkEffects = {
    onTrack: () => void;
};

export const useInternalLinkStore = (
    onClick?: () => void,
): EffectsStore<InternalLinkEffects> => {
    return {
        effects: {
            onTrack: useTrackingCallback(onClick),
        },
    };
};
