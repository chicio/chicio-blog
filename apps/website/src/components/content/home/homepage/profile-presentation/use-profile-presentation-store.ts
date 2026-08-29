"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { EffectsStore } from "@/types/component-store";
import { useCallback } from "react";

interface ProfilePresentationEffects {
    onTrackGithub: () => void;
    onTrackLinkedin: () => void;
    onTrackContact: () => void;
    onTrackMedium: () => void;
    onTrackDevto: () => void;
    onTrackTwitter: () => void;
    onTrackFacebook: () => void;
    onTrackInstagram: () => void;
}

export const useProfilePresentationStore = (): EffectsStore<ProfilePresentationEffects> => {
    const onTrackGithub = useCallback(
        () => trackWith({ action: tracking.action.open_github, category: tracking.category.home, label: tracking.label.body }),
        [],
    );
    const onTrackLinkedin = useCallback(
        () => trackWith({ action: tracking.action.open_linkedin, category: tracking.category.home, label: tracking.label.body }),
        [],
    );
    const onTrackContact = useCallback(
        () => trackWith({ action: tracking.action.open_contact, category: tracking.category.home, label: tracking.label.body }),
        [],
    );
    const onTrackMedium = useCallback(
        () => trackWith({ action: tracking.action.open_medium, category: tracking.category.home, label: tracking.label.body }),
        [],
    );
    const onTrackDevto = useCallback(
        () => trackWith({ action: tracking.action.open_devto, category: tracking.category.home, label: tracking.label.body }),
        [],
    );
    const onTrackTwitter = useCallback(
        () => trackWith({ action: tracking.action.open_twitter, category: tracking.category.home, label: tracking.label.body }),
        [],
    );
    const onTrackFacebook = useCallback(
        () => trackWith({ action: tracking.action.open_facebook, category: tracking.category.home, label: tracking.label.body }),
        [],
    );
    const onTrackInstagram = useCallback(
        () => trackWith({ action: tracking.action.open_instagram, category: tracking.category.home, label: tracking.label.body }),
        [],
    );

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
