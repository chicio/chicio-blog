"use client";

import { writeConsent } from "@/lib/consents/consents";
import { useHasConsentDecision } from "@/components/design-system/hooks/use-has-consent-decision";
import { ComponentStore } from "@/types/component-store";

interface CookieConsentBannerState {
    decided: boolean;
}

interface CookieConsentBannerEffects {
    acceptConsent: () => void;
    rejectConsent: () => void;
}

export const useCookieConsentBannerStore = (): ComponentStore<
    CookieConsentBannerState,
    CookieConsentBannerEffects
> => {
    const decided = useHasConsentDecision();

    const acceptConsent = () => writeConsent("accepted");
    const rejectConsent = () => writeConsent("rejected");

    return {
        state: { decided },
        effects: { acceptConsent, rejectConsent },
    };
};
