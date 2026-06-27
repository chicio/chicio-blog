"use client";

import type { EffectsStore } from "@/types/component-store";

type ExternalLinkEffects = {
    onTrack: () => void;
};

export const useExternalLinkStore = (
    onClick?: () => void,
): EffectsStore<ExternalLinkEffects> => {
    return {
        effects: {
            onTrack: onClick ?? (() => {}),
        },
    };
};
