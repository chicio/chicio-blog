"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { TrackingData } from "@/types/configuration/tracking";

type CallToActionExternalWithTrackingEffects = {
    onTrack: () => void;
};

export const useCallToActionExternalWithTrackingStore = (
    trackingData: TrackingData,
): { state: Record<string, never>; effects: CallToActionExternalWithTrackingEffects } => {
    return {
        state: {},
        effects: {
            onTrack: () => trackWith(trackingData),
        },
    };
};
