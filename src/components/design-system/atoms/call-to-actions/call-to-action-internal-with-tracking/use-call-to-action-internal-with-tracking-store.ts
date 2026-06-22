"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { TrackingData } from "@/types/configuration/tracking";
import { EffectsStore } from "@/types/component-store";

type CallToActionInternalWithTrackingEffects = {
    onTrack: () => void;
};

export const useCallToActionInternalWithTrackingStore = (
    trackingData: TrackingData,
): EffectsStore<CallToActionInternalWithTrackingEffects> => {
    return {
        effects: {
            onTrack: () => trackWith(trackingData),
        },
    };
};
