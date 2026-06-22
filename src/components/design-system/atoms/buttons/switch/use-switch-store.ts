"use client";

import { EffectsStore } from "@/types/component-store";

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
