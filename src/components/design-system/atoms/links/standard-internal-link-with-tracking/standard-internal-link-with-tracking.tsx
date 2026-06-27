"use client";

import Link from "next/link";
import { FC, ReactNode } from "react";
import { useStandardInternalLinkWithTrackingStore } from "./use-standard-internal-link-with-tracking-store";

type StandardInternalLinkWithTrackingProps = {
    to: string;
    className?: string;
    children?: ReactNode;
    prefetch?: boolean;
    onClick?: () => void;
};

export const StandardInternalLinkWithTracking: FC<StandardInternalLinkWithTrackingProps> = ({
    children,
    className,
    to,
    onClick,
    prefetch = false,
}) => {
    const { effects } = useStandardInternalLinkWithTrackingStore(onClick);
    const { onTrack } = effects;

    return (
        <Link className={className} href={to} prefetch={prefetch} onClick={onTrack}>
            {children}
        </Link>
    );
};
