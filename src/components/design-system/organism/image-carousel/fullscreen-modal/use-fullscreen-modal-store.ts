"use client";

import { useState, useEffect } from "react";
import { PanInfo } from "framer-motion";
import type { ComponentStore } from "@/types/component-store";

interface FullscreenModalState {
    currentIndex: number;
    modalEl: HTMLDivElement | null;
}

interface FullscreenModalEffects {
    setModalEl: (el: HTMLDivElement | null) => void;
    goToPrevious: () => void;
    goToNext: () => void;
    navigateTo: (index: number) => void;
    stopPropagation: (e: React.MouseEvent) => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    handleDragEnd: (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
}

export const useFullscreenModalStore = (
    images: string[],
    initialIndex: number,
    onClose: () => void,
    onNavigate?: (index: number) => void,
): ComponentStore<FullscreenModalState, FullscreenModalEffects> => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [modalEl, setModalEl] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        modalEl?.focus();
    }, [modalEl]);

    const goToPrevious = () => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        onNavigate?.(newIndex);
    };

    const goToNext = () => {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        onNavigate?.(newIndex);
    };

    const navigateTo = (index: number) => {
        setCurrentIndex(index);
        onNavigate?.(index);
    };

    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") { onClose(); }
        if (e.key === "ArrowLeft") { goToPrevious(); }
        if (e.key === "ArrowRight") { goToNext(); }
    };

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const swipeThreshold = 50;
        if (info.offset.x > swipeThreshold) {
            goToPrevious();
        } else if (info.offset.x < -swipeThreshold) {
            goToNext();
        }
    };

    return {
        state: { currentIndex, modalEl },
        effects: { setModalEl, goToPrevious, goToNext, navigateTo, stopPropagation, handleKeyDown, handleDragEnd },
    };
};
