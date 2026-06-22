"use client";

import { useState, useCallback } from "react";
import { ComponentStore } from "@/types/component-store";

interface CodeBlockState {
    getText: () => string;
}

interface CodeBlockEffects {
    setPreEl: (el: HTMLPreElement | null) => void;
}

export const useCodeBlockStore = (): ComponentStore<CodeBlockState, CodeBlockEffects> => {
    const [preEl, setPreEl] = useState<HTMLPreElement | null>(null);
    const getText = useCallback(() => preEl?.textContent ?? "", [preEl]);

    return {
        state: { getText },
        effects: { setPreEl },
    };
};
