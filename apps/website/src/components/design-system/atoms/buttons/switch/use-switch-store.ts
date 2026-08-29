"use client";

import type { EffectsStore } from "matrix-component-store";

type SwitchEffects = {
    onToggle: () => void;
};

export const useSwitchStore = (checked: boolean, onChange: (v: boolean) => void): EffectsStore<SwitchEffects> => {
    return {
        effects: {
            onToggle: () => onChange(!checked),
        },
    };
};
