"use client";

import { useLockBodyScroll } from "@/components/design-system/hooks/use-lock-body-scroll";

export const useOverlayStore = (): { state: Record<string, never>; effects: Record<string, never> } => {
    useLockBodyScroll();

    return {
        state: {},
        effects: {},
    };
};
