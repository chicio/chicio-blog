"use client";

import { useState } from "react";
import { ComponentStore } from "@/types/component-store";

const totalExamples = 6;

interface TreeTypesVisualizerState {
    selectedIndex: number;
    totalExamples: number;
}

interface TreeTypesVisualizerEffects {
    goToPrevious: () => void;
    goToNext: () => void;
    selectIndex: (index: number) => () => void;
}

export const useTreeTypesVisualizerStore = (): ComponentStore<TreeTypesVisualizerState, TreeTypesVisualizerEffects> => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const goToPrevious = () => {
        setSelectedIndex((prev) => (prev - 1 + totalExamples) % totalExamples);
    };

    const goToNext = () => {
        setSelectedIndex((prev) => (prev + 1) % totalExamples);
    };

    const selectIndex = (index: number) => () => {
        setSelectedIndex(index);
    };

    return {
        state: { selectedIndex, totalExamples },
        effects: { goToPrevious, goToNext, selectIndex },
    };
};
