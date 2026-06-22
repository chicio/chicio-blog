"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { TrackingData } from "@/types/configuration/tracking";
import { EffectsStore } from "@/types/component-store";

type StandardExternalLinkWithTrackingEffects = {
    onTrack: () => void;
};

export const useStandardExternalLinkWithTrackingStore = (
    trackingData: TrackingData,
): EffectsStore<StandardExternalLinkWithTrackingEffects> => {
    return {
        effects: {
            onTrack: () => trackWith(trackingData),
        },
    };
};
