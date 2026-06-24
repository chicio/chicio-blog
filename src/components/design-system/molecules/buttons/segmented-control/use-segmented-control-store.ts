"use client";

import { EffectsStore } from "@/types/component-store";

interface SegmentedControlEffects<T extends string> {
    triggerChange: (value: T) => () => void;
}

export const useSegmentedControlStore = <T extends string>(
    onChange: (value: T) => void
): EffectsStore<SegmentedControlEffects<T>> => {
    const triggerChange = (value: T) => () => onChange(value);
    return { effects: { triggerChange } };
};
