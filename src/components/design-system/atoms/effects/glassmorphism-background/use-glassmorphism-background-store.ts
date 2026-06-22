"use client";

import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { useMotionStore } from "@/components/design-system/hooks/use-motion-store";
import { StateStore } from "@/types/component-store";

type GlassmorphismBackgroundState = {
    glassmorphismClass: string;
    motionEnabled: boolean;
};

export const useGlassmorphismBackgroundStore = (): StateStore<GlassmorphismBackgroundState> => {
    const { glassmorphismClass } = useGlassmorphism();
    const motionEnabled = useMotionStore();

    return {
        state: { glassmorphismClass, motionEnabled },
    };
};
