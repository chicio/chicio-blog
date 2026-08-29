"use client";

import { useReadingProgress } from "../../hooks/use-reading-progress";
import { useReducedMotions } from "../../hooks/use-reduced-motions";
import { ScrollDirection, useScrollDirection } from "../../hooks/use-scroll-direction";
import type { StateStore } from "matrix-component-store";

interface ReadingContentProgressBarState {
    progressPercentage: number;
    isVisible: boolean;
    shouldReduceMotion: boolean;
}

export const useReadingContentProgressBarStore = (contentId: string): StateStore<ReadingContentProgressBarState> => {
    const shouldReduceMotion = useReducedMotions();
    const { percentage, started, status } = useReadingProgress(contentId);
    const direction = useScrollDirection();
    const isVisible = started && direction === ScrollDirection.down;
    const progressPercentage = status === "complete" ? 100 : percentage;

    return {
        state: { progressPercentage, isVisible, shouldReduceMotion },
    };
};
