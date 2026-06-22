"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { TrackingData } from "@/types/configuration/tracking";
import { EffectsStore } from "@/types/component-store";

type StandardInternalLinkWithTrackingEffects = {
    onTrack: () => void;
};

export const useStandardInternalLinkWithTrackingStore = (
    trackingData: TrackingData,
): EffectsStore<StandardInternalLinkWithTrackingEffects> => {
    return {
        effects: {
            onTrack: () => trackWith(trackingData),
        },
    };
};
