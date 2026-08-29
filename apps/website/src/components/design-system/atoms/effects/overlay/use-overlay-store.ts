"use client";

import { useLockBodyScroll } from "@/components/design-system/hooks/use-lock-body-scroll";

export const useOverlayStore = (): void => {
    useLockBodyScroll();
};
