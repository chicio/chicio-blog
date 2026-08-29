"use client";

import { useState } from "react";
import { ComponentStore } from "@/types/component-store";

interface RecursionVisualizerState {
    stack: { n: number }[];
    returnValue: number | null;
}

interface RecursionVisualizerEffects {
    step: () => void;
    reset: () => void;
}

export const useRecursionVisualizerStore = (): ComponentStore<
    RecursionVisualizerState,
    RecursionVisualizerEffects
> => {
    const [stack, setStack] = useState<{ n: number }[]>([{ n: 3 }]);
    const [returnValue, setReturnValue] = useState<number | null>(null);

    const step = () => {
        if (stack.length === 0) { return; }

        const top = stack[stack.length - 1];

        if (top.n === 0) {
            setStack(stack.slice(0, -1));
            setReturnValue(0);
            return;
        }

        if (returnValue !== null) {
            setStack(stack.slice(0, -1));
            setReturnValue(top.n + returnValue);
            return;
        }

        setStack([...stack, { n: top.n - 1 }]);
    };

    const reset = () => {
        setStack([{ n: 3 }]);
        setReturnValue(null);
    };

    return {
        state: { stack, returnValue },
        effects: { step, reset },
    };
};
