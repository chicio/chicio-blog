"use client";

import { useState, useCallback } from "react";
import { ComponentStore } from "@/types/component-store";

const initialCapacity = 4;
const initialArray = [1, 2, 3];

interface DynamicArrayVisualizerState {
    arr: number[];
    capacity: number;
}

interface DynamicArrayVisualizerEffects {
    push: () => void;
    reset: () => void;
}

export const useDynamicArrayVisualizerStore = (): ComponentStore<DynamicArrayVisualizerState, DynamicArrayVisualizerEffects> => {
    const [arr, setArr] = useState(initialArray);
    const [capacity, setCapacity] = useState(initialCapacity);

    const push = useCallback(() => {
        setArr((currentArr) => {
            const newCapacity = currentArr.length >= capacity ? capacity * 2 : capacity;
            if (newCapacity !== capacity) {
                setCapacity(newCapacity);
            }
            return [...currentArr, currentArr.length + 1];
        });
    }, [capacity]);

    const reset = useCallback(() => {
        setArr(initialArray);
        setCapacity(initialCapacity);
    }, []);

    return {
        state: { arr, capacity },
        effects: { push, reset },
    };
};
