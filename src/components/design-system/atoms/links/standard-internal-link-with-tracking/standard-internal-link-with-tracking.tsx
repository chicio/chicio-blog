"use client";

import { TrackingElementProps } from "@/types/configuration/tracking";
import Link from "next/link";
import { FC, ReactNode } from "react";
import { useStandardInternalLinkWithTrackingStore } from "./use-standard-internal-link-with-tracking-store";

type StandardInternalLinkWithTrackingProps = TrackingElementProps & {
    to: string;
    className?: string;
    children?: ReactNode;
    prefetch?: boolean;
};

export const StandardInternalLinkWithTracking: FC<StandardInternalLinkWithTrackingProps> = ({
    children,
    className,
    to,
    trackingData,
    prefetch = false,
}) => {
    const { effects } = useStandardInternalLinkWithTrackingStore(trackingData);
    const { onTrack } = effects;

    return (
        <Link className={className} href={to} prefetch={prefetch} onClick={onTrack}>
            {children}
        </Link>
    );
};
