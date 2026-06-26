"use client";

import { tracking } from "@/types/configuration/tracking";
import { EffectsStore } from "@/types/component-store";
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

export const useFooterStore = (
    onTrackNavigation?: (action: string) => void,
    onTrackSocial?: (action: string) => void,
): EffectsStore<FooterEffects> => {
    const onTrackHome = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_home) : undefined),
        [onTrackNavigation],
    );
    const onTrackBlog = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_blog) : undefined),
        [onTrackNavigation],
    );
    const onTrackArt = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_art) : undefined),
        [onTrackNavigation],
    );
    const onTrackAboutMe = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_about_me) : undefined),
        [onTrackNavigation],
    );
    const onTrackArchive = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_blog_archive) : undefined),
        [onTrackNavigation],
    );
    const onTrackTags = useMemo(
        () => (onTrackNavigation ? () => onTrackNavigation(tracking.action.open_blog_tags) : undefined),
        [onTrackNavigation],
    );
    const onTrackGithub = useMemo(
        () => (onTrackSocial ? () => onTrackSocial(tracking.action.open_github) : undefined),
        [onTrackSocial],
    );
    const onTrackLinkedin = useMemo(
        () => (onTrackSocial ? () => onTrackSocial(tracking.action.open_linkedin) : undefined),
        [onTrackSocial],
    );
    const onTrackContact = useMemo(
        () => (onTrackSocial ? () => onTrackSocial(tracking.action.open_contact) : undefined),
        [onTrackSocial],
    );
    const onTrackMedium = useMemo(
        () => (onTrackSocial ? () => onTrackSocial(tracking.action.open_medium) : undefined),
        [onTrackSocial],
    );
    const onTrackDevto = useMemo(
        () => (onTrackSocial ? () => onTrackSocial(tracking.action.open_devto) : undefined),
        [onTrackSocial],
    );
    const onTrackTwitter = useMemo(
        () => (onTrackSocial ? () => onTrackSocial(tracking.action.open_twitter) : undefined),
        [onTrackSocial],
    );
    const onTrackFacebook = useMemo(
        () => (onTrackSocial ? () => onTrackSocial(tracking.action.open_facebook) : undefined),
        [onTrackSocial],
    );
    const onTrackInstagram = useMemo(
        () => (onTrackSocial ? () => onTrackSocial(tracking.action.open_instagram) : undefined),
        [onTrackSocial],
    );

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
