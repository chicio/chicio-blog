"use client";

import { useCallback } from "react";
import type { EffectsStore } from "matrix-component-store";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";

interface MangaCardEffects {
    onTrackOpen: () => void;
}

export const useMangaCardStore = (): EffectsStore<MangaCardEffects> => {
    const onTrackOpen = useCallback(
        () =>
            trackWith({
                category: tracking.category.manga,
                label: tracking.label.body,
                action: tracking.action.open_manga,
            }),
        [],
    );

    return { effects: { onTrackOpen } };
};
