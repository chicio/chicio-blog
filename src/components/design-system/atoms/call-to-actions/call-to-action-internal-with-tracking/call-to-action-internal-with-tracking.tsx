"use client";

import { TrackingElementProps } from "@/types/configuration/tracking";
import Link from "next/link";
import { FC, ReactNode } from "react";
import { useCallToActionInternalWithTrackingStore } from "./use-call-to-action-internal-with-tracking-store";

type CallToActionInternalWithTrackingProps = TrackingElementProps & {
    to: string;
    className?: string;
    children?: ReactNode;
    prefetch?: boolean;
};

export const CallToActionInternalWithTracking: FC<CallToActionInternalWithTrackingProps> = ({
    children,
    className,
    to,
    trackingData,
    prefetch = false,
}) => {
    const { effects } = useCallToActionInternalWithTrackingStore(trackingData);
    const { onTrack } = effects;

    return (
        <Link
            className={`call-to-action${className ? ` ${className}` : ""}`}
            href={to}
            prefetch={prefetch}
            onClick={onTrack}
        >
            {children}
        </Link>
    );
};
