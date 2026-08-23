"use client";

import { useState } from "react";
import type { ComponentStore } from "@/types/component-store";
import type { PrefetchStrategy } from "@/types/next/prefetch";

interface InternalLinkState {
    prefetch: boolean | null | undefined;
}

interface InternalLinkEffects {
    handleMouseEnter: (() => void) | undefined;
    handleFocus: (() => void) | undefined;
}

export const useInternalLinkStore = (
    strategy: PrefetchStrategy,
): ComponentStore<InternalLinkState, InternalLinkEffects> => {
    const [intentShown, setIntentShown] = useState(false);

    if (strategy === "hover") {
        const showIntent = () => setIntentShown(true);
        return {
            state: { prefetch: intentShown ? null : false },
            effects: { handleMouseEnter: showIntent, handleFocus: showIntent },
        };
    }

    return {
        state: { prefetch: strategy === "never" ? false : undefined },
        effects: { handleMouseEnter: undefined, handleFocus: undefined },
    };
};
