"use client";

import { useInView } from "@/components/design-system/hooks/use-in-view";
import { ScrollDirection, useScrollDirection } from "@/components/design-system/hooks/use-scroll-direction";
import type { StateStore } from "@/types/component-store";
import React from "react";

interface BreadcrumbState {
    navRef: React.RefObject<HTMLElement | null>;
    isVisible: boolean;
}

export const useBreadcrumbStore = (): StateStore<BreadcrumbState> => {
    const [navRef, isInView] = useInView<HTMLElement>({ threshold: 0 });
    const direction = useScrollDirection();
    const isVisible = !isInView && direction === ScrollDirection.down;

    return { state: { navRef, isVisible } };
};
