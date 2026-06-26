"use client";

import type { EffectsStore } from "@/types/component-store";
import { useMemo } from "react";

interface FooterEffects {
    onTrackHome: (() => void) | undefined;
    onTrackBlog: (() => void) | undefined;
    onTrackArt: (() => void) | undefined;
    onTrackAboutMe: (() => void) | undefined;
    onTrackArchive: (() => void) | undefined;
    onTrackTags: (() => void) | undefined;
    onTrackGithub: (() => void) | undefined;
    onTrackLinkedin: (() => void) | undefined;
    onTrackContact: (() => void) | undefined;
    onTrackMedium: (() => void) | undefined;
    onTrackDevto: (() => void) | undefined;
    onTrackTwitter: (() => void) | undefined;
    onTrackFacebook: (() => void) | undefined;
    onTrackInstagram: (() => void) | undefined;
}

export interface FooterNavTrackingCallbacks {
    onTrackHome?: () => void;
    onTrackBlog?: () => void;
    onTrackArt?: () => void;
    onTrackAboutMe?: () => void;
    onTrackArchive?: () => void;
    onTrackTags?: () => void;
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

export const useFooterStore = (
    navTracking?: FooterNavTrackingCallbacks,
    socialTracking?: FooterSocialTrackingCallbacks,
): EffectsStore<FooterEffects> => {
    const onTrackHome = useMemo(() => navTracking?.onTrackHome, [navTracking]);
    const onTrackBlog = useMemo(() => navTracking?.onTrackBlog, [navTracking]);
    const onTrackArt = useMemo(() => navTracking?.onTrackArt, [navTracking]);
    const onTrackAboutMe = useMemo(() => navTracking?.onTrackAboutMe, [navTracking]);
    const onTrackArchive = useMemo(() => navTracking?.onTrackArchive, [navTracking]);
    const onTrackTags = useMemo(() => navTracking?.onTrackTags, [navTracking]);
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
            onTrackHome,
            onTrackBlog,
            onTrackArt,
            onTrackAboutMe,
            onTrackArchive,
            onTrackTags,
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
