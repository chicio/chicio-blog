"use client";

import Link from "next/link";
import { FC, ReactNode } from "react";
import { useCallToActionInternalWithTrackingStore } from "./use-call-to-action-internal-with-tracking-store";

type CallToActionInternalWithTrackingProps = {
    to: string;
    className?: string;
    children?: ReactNode;
    prefetch?: boolean;
    onClick?: () => void;
};

export const CallToActionInternalWithTracking: FC<CallToActionInternalWithTrackingProps> = ({
    children,
    className,
    to,
    onClick,
    prefetch = false,
}) => {
    const { effects } = useCallToActionInternalWithTrackingStore(onClick);
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
