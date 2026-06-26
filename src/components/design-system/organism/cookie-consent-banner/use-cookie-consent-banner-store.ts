"use client";

import { writeConsent } from "@/lib/consents/consents";
import { ComponentStore } from "@/types/component-store";

interface CookieConsentBannerState {
    decided: boolean;
}

interface CookieConsentBannerEffects {
    acceptConsent: () => void;
    rejectConsent: () => void;
}

export const useCookieConsentBannerStore = (
    decided: boolean,
): ComponentStore<CookieConsentBannerState, CookieConsentBannerEffects> => {
    const acceptConsent = () => writeConsent("accepted");
    const rejectConsent = () => writeConsent("rejected");

    return {
        state: { decided },
        effects: { acceptConsent, rejectConsent },
    };
};
