"use client";

import { useState, useCallback } from "react";
import { ComponentStore } from "@/types/component-store";

interface KadaneVisualizerState {
    currentIndex: number;
    currentMax: number;
    globalMax: number;
    highlighted: number[];
    currentSubarray: number[];
    finished: boolean;
}

interface KadaneVisualizerEffects {
    stepForward: (nums: number[]) => () => void;
    resetVisualization: (nums: number[]) => () => void;
}

export const useKadaneVisualizerStore = (nums: number[]): ComponentStore<KadaneVisualizerState, KadaneVisualizerEffects> => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentMax, setCurrentMax] = useState(nums[0] || 0);
    const [globalMax, setGlobalMax] = useState(nums[0] || 0);
    const [highlighted, setHighlighted] = useState<number[]>([0]);
    const [currentSubarray, setCurrentSubarray] = useState<number[]>([nums[0]]);
    const [finished, setFinished] = useState(false);

    const stepForward = useCallback(
        (numsArr: number[]) => () => {
            if (currentIndex >= numsArr.length - 1) {
                setFinished(true);
                return;
            }

            const idx = currentIndex + 1;
            let newCurrMax = currentMax + numsArr[idx];
            let newSubarray = [...currentSubarray];

            if (currentMax + numsArr[idx] < numsArr[idx]) {
                newCurrMax = numsArr[idx];
                newSubarray = [numsArr[idx]];
            } else {
                newSubarray.push(numsArr[idx]);
            }

            const newGlobalMax = Math.max(globalMax, newCurrMax);

            setCurrentIndex(idx);
            setCurrentMax(newCurrMax);
            setGlobalMax(newGlobalMax);
            setCurrentSubarray(newSubarray);
            setHighlighted([...newSubarray.map((_, i) => idx - newSubarray.length + 1 + i)]);

            if (idx === numsArr.length - 1) {
                setFinished(true);
            }
        },
        [currentIndex, currentMax, currentSubarray, globalMax],
    );

    const resetVisualization = useCallback(
        (numsArr: number[]) => () => {
            setCurrentIndex(0);
            setCurrentMax(numsArr[0] || 0);
            setGlobalMax(numsArr[0] || 0);
            setHighlighted([0]);
            setCurrentSubarray([numsArr[0]]);
            setFinished(false);
        },
        [],
    );

    return {
        state: {
            currentIndex,
            currentMax,
            globalMax,
            highlighted,
            currentSubarray,
            finished,
        },
        effects: { stepForward, resetVisualization },
    };
};
