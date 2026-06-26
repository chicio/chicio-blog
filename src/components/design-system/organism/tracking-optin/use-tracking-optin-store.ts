"use client";

import { StateStore } from "@/types/component-store";

interface TrackingOptInState {
    enabled: boolean;
}

export const useTrackingOptinStore = (enabled: boolean): StateStore<TrackingOptInState> => {
    return {
        state: { enabled },
    };
};
