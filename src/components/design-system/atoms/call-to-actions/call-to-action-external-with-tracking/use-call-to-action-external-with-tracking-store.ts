"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { TrackingData } from "@/types/configuration/tracking";
import { EffectsStore } from "@/types/component-store";

type CallToActionExternalWithTrackingEffects = {
    onTrack: () => void;
};

export const useCallToActionExternalWithTrackingStore = (
    trackingData: TrackingData,
): EffectsStore<CallToActionExternalWithTrackingEffects> => {
    return {
        effects: {
            onTrack: () => trackWith(trackingData),
        },
    };
};
