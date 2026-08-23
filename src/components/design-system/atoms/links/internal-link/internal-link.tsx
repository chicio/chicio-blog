"use client";

import Link from "next/link";
import { FC, ReactNode } from "react";
import type { PrefetchStrategy } from "@/types/next/prefetch";
import { useInternalLinkStore } from "./use-internal-link-store";

type InternalLinkProps = {
    to: string;
    className?: string;
    children?: ReactNode;
    prefetch?: PrefetchStrategy;
    onClick?: () => void;
};

export const InternalLink: FC<InternalLinkProps> = ({
    children,
    className,
    to,
    onClick,
    prefetch = "viewport",
}) => {
    const { state, effects } = useInternalLinkStore(prefetch);
    const { prefetch: prefetchProp } = state;
    const { handleMouseEnter } = effects;

    return (
        <Link
            className={className}
            href={to}
            prefetch={prefetchProp}
            onMouseEnter={handleMouseEnter}
            onClick={onClick}
        >
            {children}
        </Link>
    );
};
