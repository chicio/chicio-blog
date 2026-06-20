"use client";

import { useMotionStore } from "@/components/design-system/hooks/use-motion-store";

type LoaderState = {
    motionEnabled: boolean;
};

export const useLoaderStore = (): { state: LoaderState; effects: Record<string, never> } => {
    const motionEnabled = useMotionStore();

    return {
        state: { motionEnabled },
        effects: {},
    };
};
