"use client";

import { TrackingElementProps } from "@/types/configuration/tracking";
import { FC, ReactNode } from "react";
import { useStandardExternalLinkWithTrackingStore } from "./use-standard-external-link-with-tracking-store";

type StandardExternalLinkWithTrackingProps = TrackingElementProps & {
    href: string;
    target?: string;
    rel?: string;
    children?: ReactNode;
    className?: string;
};

export const StandardExternalLinkWithTracking: FC<StandardExternalLinkWithTrackingProps> = ({
    children,
    href,
    trackingData,
    target,
    rel,
    className,
}) => {
    const { effects } = useStandardExternalLinkWithTrackingStore(trackingData);
    const { onTrack } = effects;

    return (
        <a href={href} onClick={onTrack} className={className} target={target} rel={rel}>
            {children}
        </a>
    );
};
