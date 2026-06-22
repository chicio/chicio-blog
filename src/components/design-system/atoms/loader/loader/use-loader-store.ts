"use client";

import { useMotionStore } from "@/components/design-system/hooks/use-motion-store";
import { StateStore } from "@/types/component-store";

type LoaderState = {
    motionEnabled: boolean;
};

export const useLoaderStore = (): StateStore<LoaderState> => {
    const motionEnabled = useMotionStore();

    return {
        state: { motionEnabled },
    };
};
