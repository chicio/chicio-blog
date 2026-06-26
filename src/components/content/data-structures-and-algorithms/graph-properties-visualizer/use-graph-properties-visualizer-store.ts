"use client";

import { useState, useCallback } from "react";
import { ComponentStore } from "@/types/component-store";

interface GraphPropertiesVisualizerState {
    selectedIndex: number;
    totalExamples: number;
}

interface GraphPropertiesVisualizerEffects {
    goToPrevious: () => void;
    goToNext: () => void;
    selectIndex: (index: number) => () => void;
}

export const useGraphPropertiesVisualizerStore = (
    totalExamples: number,
): ComponentStore<GraphPropertiesVisualizerState, GraphPropertiesVisualizerEffects> => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const goToPrevious = useCallback(() => {
        setSelectedIndex((prev) => (prev - 1 + totalExamples) % totalExamples);
    }, [totalExamples]);

    const goToNext = useCallback(() => {
        setSelectedIndex((prev) => (prev + 1) % totalExamples);
    }, [totalExamples]);

    const selectIndex = useCallback((index: number) => () => {
        setSelectedIndex(index);
    }, []);

    return {
        state: { selectedIndex, totalExamples },
        effects: { goToPrevious, goToNext, selectIndex },
    };
};
