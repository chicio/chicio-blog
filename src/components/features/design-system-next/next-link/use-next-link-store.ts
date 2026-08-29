"use client";

import { MouseEventHandler, FocusEventHandler, useState } from "react";
import type { ComponentStore } from "@/types/component-store";
import type { PrefetchStrategy } from "@/components/design-system/atoms/links/anchor-link";

interface NextLinkState {
    prefetch: boolean | null | undefined;
}

interface NextLinkEffects {
    handleMouseEnter: MouseEventHandler<HTMLAnchorElement> | undefined;
    handleFocus: FocusEventHandler<HTMLAnchorElement> | undefined;
}

/**
 * Maps the design system's prefetch strategy onto next/link's own API.
 *
 * Every route here is statically prerendered, so a prefetched click costs no server round trip,
 * which makes prefetching cheap enough to default to on. `"hover"` defers that cost until the
 * pointer or focus arrives, for link-dense pages where prefetching everything visible is
 * disproportionate to the odds any one link is clicked.
 */
export const useNextLinkStore = (
    strategy: PrefetchStrategy,
    onMouseEnter?: MouseEventHandler<HTMLAnchorElement>,
    onFocus?: FocusEventHandler<HTMLAnchorElement>,
): ComponentStore<NextLinkState, NextLinkEffects> => {
    const [intentShown, setIntentShown] = useState(false);

    if (strategy === "hover") {
        const handleMouseEnter: MouseEventHandler<HTMLAnchorElement> = (event) => {
            setIntentShown(true);
            onMouseEnter?.(event);
        };
        const handleFocus: FocusEventHandler<HTMLAnchorElement> = (event) => {
            setIntentShown(true);
            onFocus?.(event);
        };

        return {
            state: { prefetch: intentShown ? null : false },
            effects: { handleMouseEnter, handleFocus },
        };
    }

    return {
        state: { prefetch: strategy === "never" ? false : undefined },
        effects: { handleMouseEnter: onMouseEnter, handleFocus: onFocus },
    };
};
