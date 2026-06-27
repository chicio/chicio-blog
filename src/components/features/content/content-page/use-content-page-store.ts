"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { EffectsStore } from "@/types/component-store";
import type { MenuTrackingCallbacks } from "@/components/design-system/organism/menu";
import type { FooterNavTrackingCallbacks, FooterSocialTrackingCallbacks } from "@/components/design-system/organism/footer";
import { useCallback } from "react";

interface ContentPageEffects {
    onPaletteTrigger: () => void;
    menuTracking: MenuTrackingCallbacks;
    footerNavTracking: FooterNavTrackingCallbacks;
    footerSocialTracking: FooterSocialTrackingCallbacks;
}

export const useContentPageStore = (trackingCategory: string): EffectsStore<ContentPageEffects> => {
    const onPaletteTrigger = useCallback(() => {
        trackWith({
            category: trackingCategory,
            label: tracking.label.header,
            action: tracking.action.command_palette_open,
        });
    }, [trackingCategory]);

    const onTrackNavigation = useCallback(
        (action: string) => {
            trackWith({
                category: trackingCategory,
                label: tracking.label.header,
                action,
            });
        },
        [trackingCategory],
    );

    const onTrackSocial = useCallback(
        (action: string) => {
            trackWith({
                category: trackingCategory,
                label: tracking.label.footer,
                action,
            });
        },
        [trackingCategory],
    );

    const onTrackHome = useCallback(() => onTrackNavigation(tracking.action.open_home), [onTrackNavigation]);
    const onTrackBlog = useCallback(() => onTrackNavigation(tracking.action.open_blog), [onTrackNavigation]);
    const onTrackDsaRoadmap = useCallback(() => onTrackNavigation(tracking.action.open_dsa_roadmap), [onTrackNavigation]);
    const onTrackDsaExercises = useCallback(
        () => onTrackNavigation(tracking.action.open_dsa_exercises),
        [onTrackNavigation],
    );
    const onTrackChat = useCallback(() => onTrackNavigation(tracking.action.open_chat), [onTrackNavigation]);
    const onTrackMcp = useCallback(() => onTrackNavigation(tracking.action.open_mcp), [onTrackNavigation]);
    const onTrackMatrixRain = useCallback(
        () => onTrackNavigation(tracking.action.open_matrix_rain_webgpu),
        [onTrackNavigation],
    );
    const onTrackAboutMe = useCallback(() => onTrackNavigation(tracking.action.open_about_me), [onTrackNavigation]);
    const onTrackArt = useCallback(() => onTrackNavigation(tracking.action.open_art), [onTrackNavigation]);
    const onTrackVideogames = useCallback(
        () => onTrackNavigation(tracking.action.open_videogame_collection),
        [onTrackNavigation],
    );
    const onTrackContact = useCallback(() => onTrackNavigation(tracking.action.open_contact), [onTrackNavigation]);
    const onTrackArchive = useCallback(() => onTrackNavigation(tracking.action.open_blog_archive), [onTrackNavigation]);
    const onTrackTags = useCallback(() => onTrackNavigation(tracking.action.open_blog_tags), [onTrackNavigation]);

    const onTrackGithub = useCallback(() => onTrackSocial(tracking.action.open_github), [onTrackSocial]);
    const onTrackLinkedin = useCallback(() => onTrackSocial(tracking.action.open_linkedin), [onTrackSocial]);
    const onTrackContactSocial = useCallback(() => onTrackSocial(tracking.action.open_contact), [onTrackSocial]);
    const onTrackMedium = useCallback(() => onTrackSocial(tracking.action.open_medium), [onTrackSocial]);
    const onTrackDevto = useCallback(() => onTrackSocial(tracking.action.open_devto), [onTrackSocial]);
    const onTrackTwitter = useCallback(() => onTrackSocial(tracking.action.open_twitter), [onTrackSocial]);
    const onTrackFacebook = useCallback(() => onTrackSocial(tracking.action.open_facebook), [onTrackSocial]);
    const onTrackInstagram = useCallback(() => onTrackSocial(tracking.action.open_instagram), [onTrackSocial]);

    const menuTracking: MenuTrackingCallbacks = {
        onTrackHome,
        onTrackBlog,
        onTrackDsaRoadmap,
        onTrackDsaExercises,
        onTrackChat,
        onTrackMcp,
        onTrackMatrixRain,
        onTrackAboutMe,
        onTrackArt,
        onTrackVideogames,
        onTrackContact,
    };

    const footerNavTracking: FooterNavTrackingCallbacks = {
        onTrackHome,
        onTrackBlog,
        onTrackArt,
        onTrackAboutMe,
        onTrackArchive,
        onTrackTags,
    };

    const footerSocialTracking: FooterSocialTrackingCallbacks = {
        onTrackGithub,
        onTrackLinkedin,
        onTrackContact: onTrackContactSocial,
        onTrackMedium,
        onTrackDevto,
        onTrackTwitter,
        onTrackFacebook,
        onTrackInstagram,
    };

    return {
        effects: { onPaletteTrigger, menuTracking, footerNavTracking, footerSocialTracking },
    };
};
