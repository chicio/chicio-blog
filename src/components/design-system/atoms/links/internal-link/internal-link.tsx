"use client";

import Link from "next/link";
import { FC, ReactNode } from "react";
import { useInternalLinkStore } from "./use-internal-link-store";

type InternalLinkProps = {
    to: string;
    className?: string;
    children?: ReactNode;
    prefetch?: boolean;
    onClick?: () => void;
};

export const InternalLink: FC<InternalLinkProps> = ({
    children,
    className,
    to,
    onClick,
    prefetch = false,
}) => {
    const { effects } = useInternalLinkStore(onClick);
    const { onTrack } = effects;

    return (
        <Link className={className} href={to} prefetch={prefetch} onClick={onTrack}>
            {children}
        </Link>
    );
};
