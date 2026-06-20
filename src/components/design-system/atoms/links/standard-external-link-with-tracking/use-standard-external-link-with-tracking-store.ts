"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { TrackingData } from "@/types/configuration/tracking";

type StandardExternalLinkWithTrackingEffects = {
    onTrack: () => void;
};

export const useStandardExternalLinkWithTrackingStore = (
    trackingData: TrackingData,
): { state: Record<string, never>; effects: StandardExternalLinkWithTrackingEffects } => {
    return {
        state: {},
        effects: {
            onTrack: () => trackWith(trackingData),
        },
    };
};
