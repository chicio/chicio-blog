"use client";

import React, { useState, useCallback } from "react";
import { ComponentStore } from "@/types/component-store";

interface BitwiseVisualizerState {
    a: number;
    b: number;
}

interface BitwiseVisualizerEffects {
    onAChange: React.ChangeEventHandler<HTMLInputElement>;
    onBChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const useBitwiseVisualizerStore = (): ComponentStore<BitwiseVisualizerState, BitwiseVisualizerEffects> => {
    const [a, setARaw] = useState(5);
    const [b, setBRaw] = useState(3);

    const onAChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => setARaw(parseInt(e.target.value) || 0),
        [],
    );
    const onBChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => setBRaw(parseInt(e.target.value) || 0),
        [],
    );

    return {
        state: { a, b },
        effects: { onAChange, onBChange },
    };
};
