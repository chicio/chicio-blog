"use client";

import { useState } from "react";
import { PanInfo } from "framer-motion";
import { ComponentStore } from "@/types/component-store";

interface ImageCarouselState {
    currentIndex: number;
    isFullscreen: boolean;
}

interface ImageCarouselEffects {
    goToPrevious: () => void;
    goToNext: () => void;
    openFullscreen: () => void;
    closeFullscreen: () => void;
    setCurrentIndex: (index: number) => void;
    handleDragEnd: (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
}

export const useImageCarouselStore = (imagesLength: number): ComponentStore<ImageCarouselState, ImageCarouselEffects> => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? imagesLength - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === imagesLength - 1 ? 0 : prev + 1));
    };

    const openFullscreen = () => setIsFullscreen(true);
    const closeFullscreen = () => setIsFullscreen(false);

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const swipeThreshold = 50;
        if (info.offset.x > swipeThreshold) {
            goToPrevious();
        } else if (info.offset.x < -swipeThreshold) {
            goToNext();
        }
    };

    return {
        state: { currentIndex, isFullscreen },
        effects: { goToPrevious, goToNext, openFullscreen, closeFullscreen, setCurrentIndex, handleDragEnd },
    };
};
