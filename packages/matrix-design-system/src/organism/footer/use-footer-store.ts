"use client";

import type { EffectsStore } from "matrix-component-store";
import { useMemo } from "react";

interface FooterEffects {
    onTrackGithub: (() => void) | undefined;
    onTrackLinkedin: (() => void) | undefined;
    onTrackContact: (() => void) | undefined;
    onTrackMedium: (() => void) | undefined;
    onTrackDevto: (() => void) | undefined;
    onTrackTwitter: (() => void) | undefined;
    onTrackFacebook: (() => void) | undefined;
    onTrackInstagram: (() => void) | undefined;
}

export interface FooterSocialTrackingCallbacks {
    onTrackGithub?: () => void;
    onTrackLinkedin?: () => void;
    onTrackContact?: () => void;
    onTrackMedium?: () => void;
    onTrackDevto?: () => void;
    onTrackTwitter?: () => void;
    onTrackFacebook?: () => void;
    onTrackInstagram?: () => void;
}

export const useFooterStore = (socialTracking?: FooterSocialTrackingCallbacks): EffectsStore<FooterEffects> => {
    const onTrackGithub = useMemo(() => socialTracking?.onTrackGithub, [socialTracking]);
    const onTrackLinkedin = useMemo(() => socialTracking?.onTrackLinkedin, [socialTracking]);
    const onTrackContact = useMemo(() => socialTracking?.onTrackContact, [socialTracking]);
    const onTrackMedium = useMemo(() => socialTracking?.onTrackMedium, [socialTracking]);
    const onTrackDevto = useMemo(() => socialTracking?.onTrackDevto, [socialTracking]);
    const onTrackTwitter = useMemo(() => socialTracking?.onTrackTwitter, [socialTracking]);
    const onTrackFacebook = useMemo(() => socialTracking?.onTrackFacebook, [socialTracking]);
    const onTrackInstagram = useMemo(() => socialTracking?.onTrackInstagram, [socialTracking]);

    return {
        effects: {
            onTrackGithub,
            onTrackLinkedin,
            onTrackContact,
            onTrackMedium,
            onTrackDevto,
            onTrackTwitter,
            onTrackFacebook,
            onTrackInstagram,
        },
    };
};
