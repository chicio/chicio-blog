"use client";

import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import type { StateStore } from "@/types/component-store";

type GlassmorphismBackgroundState = {
    glassmorphismClass: string;
};

export const useGlassmorphismBackgroundStore = (): StateStore<GlassmorphismBackgroundState> => {
    const { glassmorphismClass } = useGlassmorphism();

    return {
        state: { glassmorphismClass },
    };
};
