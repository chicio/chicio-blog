"use client";

import { useCallback } from "react";
import { openLightbox } from "@/components/design-system/state/lightbox/lightbox-events";
import type { EffectsStore } from "@/types/component-store";

interface LightboxImageEffects {
    handleOpen: () => void;
}

export const useLightboxImageStore = (src: string, alt: string): EffectsStore<LightboxImageEffects> => {
    const handleOpen = useCallback(() => {
        openLightbox({ src, alt });
    }, [src, alt]);

    return { effects: { handleOpen } };
};
