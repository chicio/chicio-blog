"use client";

import NextJsLink from "next/link";
import { FC } from "react";
import { type LinkComponentProps } from "matrix-design-system";
import { useNextLinkStore } from "./use-next-link-store";

/**
 * The design system's link contract, implemented with next/link. This is where the abstract
 * prefetch strategy is translated into Next's own prefetch API — the design system says *when* to
 * prefetch, this decides *how*.
 */
export const NextLink: FC<LinkComponentProps> = ({
    href,
    children,
    prefetch = "viewport",
    onMouseEnter,
    onFocus,
    ...rest
}) => {
    const { state, effects } = useNextLinkStore(prefetch, onMouseEnter, onFocus);
    const { prefetch: nextPrefetch } = state;
    const { handleMouseEnter, handleFocus } = effects;

    return (
        <NextJsLink href={href} prefetch={nextPrefetch} onMouseEnter={handleMouseEnter} onFocus={handleFocus} {...rest}>
            {children}
        </NextJsLink>
    );
};
