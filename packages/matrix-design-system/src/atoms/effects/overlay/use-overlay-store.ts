"use client";

import { useLockBodyScroll } from "../../../hooks/use-lock-body-scroll";

export const useOverlayStore = (): void => {
    useLockBodyScroll();
};
