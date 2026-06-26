"use client";

import { EffectsStore } from "@/types/component-store";

interface CookieConsentBannerEffects {
    acceptConsent: () => void;
    rejectConsent: () => void;
}

export const useCookieConsentBannerStore = (
    onAccept: () => void,
    onReject: () => void,
): EffectsStore<CookieConsentBannerEffects> => {
    return {
        effects: { acceptConsent: onAccept, rejectConsent: onReject },
    };
};
