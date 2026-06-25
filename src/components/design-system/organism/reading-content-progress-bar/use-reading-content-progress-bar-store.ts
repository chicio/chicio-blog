"use client";

import { useReadingProgress } from "@/components/design-system/hooks/use-reading-progress";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import { ScrollDirection, useScrollDirection } from "@/components/design-system/hooks/use-scroll-direction";
import { StateStore } from "@/types/component-store";

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
