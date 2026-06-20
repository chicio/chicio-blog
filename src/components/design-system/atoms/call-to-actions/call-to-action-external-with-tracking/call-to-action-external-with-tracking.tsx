"use client";

import { FC, ReactNode } from "react";
import { TrackingElementProps } from "@/types/configuration/tracking";
import { useCallToActionExternalWithTrackingStore } from "./use-call-to-action-external-with-tracking-store";

type CallToActionExternalWithTrackingProps = TrackingElementProps & {
    href: string;
    className?: string;
    target?: string;
    rel?: string;
    children?: ReactNode;
};

export const CallToActionExternalWithTracking: FC<CallToActionExternalWithTrackingProps> = ({
    children,
    className,
    href,
    trackingData,
    target,
    rel,
}) => {
    const { effects } = useCallToActionExternalWithTrackingStore(trackingData);
    const { onTrack } = effects;

    return (
        <a
            className={`call-to-action${className ? ` ${className}` : ""}`}
            href={href}
            onClick={onTrack}
            target={target}
            rel={rel}
        >
            {children}
        </a>
    );
};
