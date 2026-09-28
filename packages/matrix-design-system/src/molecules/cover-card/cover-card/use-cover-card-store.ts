"use client";

import { useCallback } from "react";
import type { ComponentStore } from "matrix-component-store";
import { useInViewList } from "../../../hooks/use-in-view-list";
import { openLightbox } from "../../../state/lightbox/lightbox-events";

interface CoverCardState {
    isInView: boolean;
}

interface CoverCardEffects {
    setEl: (el: HTMLDivElement | null) => void;
    handleOpenLightbox: () => void;
}

export const useCoverCardStore = (src: string, title: string): ComponentStore<CoverCardState, CoverCardEffects> => {
    const [setEl, isInView] = useInViewList<HTMLDivElement>({ rootMargin: "600px" });

    const handleOpenLightbox = useCallback(() => {
        openLightbox({ src, alt: title });
    }, [src, title]);

    return {
        state: { isInView },
        effects: { setEl, handleOpenLightbox },
    };
};
