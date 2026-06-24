"use client";

import { EffectsStore } from "@/types/component-store";
import React from "react";

interface ControlSliderEffects {
    handleChange: (onChange: (v: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useControlSliderStore = (): EffectsStore<ControlSliderEffects> => {
    const handleChange =
        (onChange: (v: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(parseFloat(e.target.value));
        };

    return { effects: { handleChange } };
};
