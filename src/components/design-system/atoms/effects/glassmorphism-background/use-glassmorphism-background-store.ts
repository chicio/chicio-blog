"use client";

import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { useMotionStore } from "@/components/design-system/hooks/use-motion-store";

type GlassmorphismBackgroundState = {
    glassmorphismClass: string;
    motionEnabled: boolean;
};

export const useGlassmorphismBackgroundStore = (): {
    state: GlassmorphismBackgroundState;
    effects: Record<string, never>;
} => {
    const { glassmorphismClass } = useGlassmorphism();
    const motionEnabled = useMotionStore();

    return {
        state: { glassmorphismClass, motionEnabled },
        effects: {},
    };
};
