"use client";

type SwitchEffects = {
    onToggle: () => void;
};

export const useSwitchStore = (checked: boolean, onChange: (v: boolean) => void): { state: Record<string, never>; effects: SwitchEffects } => {
    return {
        state: {},
        effects: {
            onToggle: () => onChange(!checked),
        },
    };
};
