"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { ComponentStore } from "matrix-component-store";
import type { MenuEntry } from "@/components/features/design-system-next/menu";
import type { FooterLink, FooterSocialTrackingCallbacks } from "@/components/features/design-system-next/footer";
import { useCallback } from "react";
import { buildFooterLinks, buildMenuEntries } from "../nav-config";

interface ReadingContentPageState {
    menuEntries: MenuEntry[];
    footerLinks: FooterLink[];
}

interface ReadingContentPageEffects {
    onPaletteTrigger: () => void;
    footerSocialTracking: FooterSocialTrackingCallbacks;
}

export const useReadingContentPageStore = (
    trackingCategory: string = "",
): ComponentStore<ReadingContentPageState, ReadingContentPageEffects> => {
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

    const onTrackGithub = useCallback(() => onTrackSocial(tracking.action.open_github), [onTrackSocial]);
    const onTrackLinkedin = useCallback(() => onTrackSocial(tracking.action.open_linkedin), [onTrackSocial]);
    const onTrackContact = useCallback(() => onTrackSocial(tracking.action.open_contact), [onTrackSocial]);
    const onTrackMedium = useCallback(() => onTrackSocial(tracking.action.open_medium), [onTrackSocial]);
    const onTrackDevto = useCallback(() => onTrackSocial(tracking.action.open_devto), [onTrackSocial]);
    const onTrackTwitter = useCallback(() => onTrackSocial(tracking.action.open_twitter), [onTrackSocial]);
    const onTrackFacebook = useCallback(() => onTrackSocial(tracking.action.open_facebook), [onTrackSocial]);
    const onTrackInstagram = useCallback(() => onTrackSocial(tracking.action.open_instagram), [onTrackSocial]);

    const footerSocialTracking: FooterSocialTrackingCallbacks = {
        onTrackGithub,
        onTrackLinkedin,
        onTrackContact,
        onTrackMedium,
        onTrackDevto,
        onTrackTwitter,
        onTrackFacebook,
        onTrackInstagram,
    };

    return {
        state: {
            menuEntries: buildMenuEntries(onTrackNavigation),
            footerLinks: buildFooterLinks(onTrackNavigation),
        },
        effects: { onPaletteTrigger, footerSocialTracking },
    };
};
