"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { TrackingData } from "@/types/configuration/tracking";

type CallToActionInternalWithTrackingEffects = {
    onTrack: () => void;
};

export const useCallToActionInternalWithTrackingStore = (
    trackingData: TrackingData,
): { state: Record<string, never>; effects: CallToActionInternalWithTrackingEffects } => {
    return {
        state: {},
        effects: {
            onTrack: () => trackWith(trackingData),
        },
    };
};
