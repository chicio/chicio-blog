"use client";

import { useConsentStore } from "@/components/design-system/hooks/use-consent-store";
import { StateStore } from "@/types/component-store";

interface TrackingOptInState {
    enabled: boolean;
}

export const useTrackingOptinStore = (): StateStore<TrackingOptInState> => {
    const enabled = useConsentStore();

    return {
        state: { enabled },
    };
};
