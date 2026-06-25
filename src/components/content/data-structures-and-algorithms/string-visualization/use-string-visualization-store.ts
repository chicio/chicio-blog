"use client";

import { useState } from "react";
import { ComponentStore } from "@/types/component-store";

const inputString = "hello";
const addedString = " world";

interface StringVisualizationState {
    result: string[];
    inputLength: number;
}

interface StringVisualizationEffects {
    handleConcatenate: () => void;
}

export const useStringVisualizationStore = (): ComponentStore<StringVisualizationState, StringVisualizationEffects> => {
    const [result, setResult] = useState<string[]>(inputString.split(""));

    const handleConcatenate = () => {
        const newStr = [...inputString.split(""), ...addedString.split("")];
        setResult(newStr);
    };

    return {
        state: { result, inputLength: inputString.length },
        effects: { handleConcatenate },
    };
};
