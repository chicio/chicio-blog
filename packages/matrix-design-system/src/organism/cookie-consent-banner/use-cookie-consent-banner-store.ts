"use client";

import type { EffectsStore } from "matrix-component-store";

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
