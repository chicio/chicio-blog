"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { EffectsStore } from "@/types/component-store";
import { useCallback } from "react";

interface ReadingContentPageEffects {
    onPaletteTrigger: () => void;
    onTrackNavigation: (action: string) => void;
    onTrackSocial: (action: string) => void;
}

export const useReadingContentPageStore = (trackingCategory: string = ""): EffectsStore<ReadingContentPageEffects> => {
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

    return {
        effects: { onPaletteTrigger, onTrackNavigation, onTrackSocial },
    };
};
