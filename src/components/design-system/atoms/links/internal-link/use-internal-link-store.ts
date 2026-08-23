"use client";

import { useState } from "react";
import type { ComponentStore } from "@/types/component-store";
import type { PrefetchStrategy } from "@/types/next/prefetch";

interface InternalLinkState {
    prefetch: boolean | null | undefined;
}

interface InternalLinkEffects {
    handleMouseEnter: (() => void) | undefined;
}

export const useInternalLinkStore = (
    strategy: PrefetchStrategy,
): ComponentStore<InternalLinkState, InternalLinkEffects> => {
    const [hovered, setHovered] = useState(false);

    if (strategy === "hover") {
        return {
            state: { prefetch: hovered ? null : false },
            effects: { handleMouseEnter: () => setHovered(true) },
        };
    }

    return {
        state: { prefetch: strategy === "never" ? false : undefined },
        effects: { handleMouseEnter: undefined },
    };
};
