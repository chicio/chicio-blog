"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { TrackingData } from "@/types/configuration/tracking";

type StandardInternalLinkWithTrackingEffects = {
    onTrack: () => void;
};

export const useStandardInternalLinkWithTrackingStore = (
    trackingData: TrackingData,
): { state: Record<string, never>; effects: StandardInternalLinkWithTrackingEffects } => {
    return {
        state: {},
        effects: {
            onTrack: () => trackWith(trackingData),
        },
    };
};
