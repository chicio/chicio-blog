"use client";

import { useCallback, useEffect } from "react";
import { contactQueue } from "@/lib/background-sync/contact-queue";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { useConsentStore } from "@/components/features/consent/use-consent-store";
import { useHasConsentDecision } from "@/components/features/consent/use-has-consent-decision";
import { writeConsent } from "@/lib/consents/consents";
import { ComponentStore } from "@/types/component-store";

interface LayoutAdditionalContentState {
    consented: boolean;
    decided: boolean;
}

interface LayoutAdditionalContentEffects {
    acceptConsent: () => void;
    rejectConsent: () => void;
    trackCommandPaletteOpen: () => void;
    trackCommandPaletteOpenChat: () => void;
    trackCommandPaletteSearchResultSelect: () => void;
    trackCommandPaletteToggleMotion: () => void;
    trackCommandPaletteCustomizeMatrixRain: () => void;
    trackCommandPaletteOpenEasterEggHunt: () => void;
}

export const useLayoutAdditionalContentStore = (): ComponentStore<
    LayoutAdditionalContentState,
    LayoutAdditionalContentEffects
> => {
    const consented = useConsentStore();
    const decided = useHasConsentDecision();

    const acceptConsent = useCallback(() => writeConsent("accepted"), []);
    const rejectConsent = useCallback(() => writeConsent("rejected"), []);

    const trackCommandPaletteOpen = useCallback(() => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.header,
            action: tracking.action.command_palette_open,
        });
    }, []);

    const trackCommandPaletteOpenChat = useCallback(() => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_open_chat,
        });
    }, []);

    const trackCommandPaletteSearchResultSelect = useCallback(() => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_search_result_selected,
        });
    }, []);

    const trackCommandPaletteToggleMotion = useCallback(() => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_toggle_motion,
        });
    }, []);

    const trackCommandPaletteCustomizeMatrixRain = useCallback(() => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_open_matrix_rain_panel,
        });
    }, []);

    const trackCommandPaletteOpenEasterEggHunt = useCallback(() => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_open_easter_egg_hunt,
        });
    }, []);

    useEffect(() => {
        const replayQueue = async () => {
            while (!contactQueue.isEmpty()) {
                const entry = contactQueue.dequeue();
                if (!entry) {
                    break;
                }
                try {
                    await fetch("/api/contact", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: entry.name,
                            email: entry.email,
                            message: entry.message,
                            honeypot: entry.honeypot,
                        }),
                    });
                    trackWith({
                        action: tracking.action.contact_queue_replayed,
                        category: tracking.category.pwa,
                        label: tracking.label.body,
                    });
                } catch {
                    // Single attempt — entry already dequeued, discard on failure
                }
            }
        };

        window.addEventListener("online", replayQueue);
        if (navigator.onLine) {
            replayQueue();
        }
        return () => {
            window.removeEventListener("online", replayQueue);
        };
    }, []);

    return {
        state: { consented, decided },
        effects: {
            acceptConsent,
            rejectConsent,
            trackCommandPaletteOpen,
            trackCommandPaletteOpenChat,
            trackCommandPaletteSearchResultSelect,
            trackCommandPaletteToggleMotion,
            trackCommandPaletteCustomizeMatrixRain,
            trackCommandPaletteOpenEasterEggHunt,
        },
    };
};
