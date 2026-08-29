"use client";

import { useState } from "react";
import { ComponentStore } from "@/types/component-store";

const initialCapacity = 8;
const initialStack = [1, 2];

interface StackVisualizerState {
    stack: number[];
    capacity: number;
}

interface StackVisualizerEffects {
    push: () => void;
    pop: () => void;
}

export const useStackVisualizerStore = (): ComponentStore<StackVisualizerState, StackVisualizerEffects> => {
    const [stack, setStack] = useState<number[]>(initialStack);
    const [capacity] = useState(initialCapacity);

    const push = () => {
        if (stack.length >= capacity) { return; }
        const nextValue = stack.length > 0 ? stack[stack.length - 1] + 1 : 1;
        setStack([...stack, nextValue]);
    };

    const pop = () => {
        if (stack.length === 0) { return; }
        setStack(stack.slice(0, stack.length - 1));
    };

    return {
        state: { stack, capacity },
        effects: { push, pop },
    };
};
