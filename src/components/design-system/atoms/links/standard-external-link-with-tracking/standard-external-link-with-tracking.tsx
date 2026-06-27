"use client";

import { FC, ReactNode } from "react";
import { useStandardExternalLinkWithTrackingStore } from "./use-standard-external-link-with-tracking-store";

type StandardExternalLinkWithTrackingProps = {
    href: string;
    target?: string;
    rel?: string;
    children?: ReactNode;
    className?: string;
    onClick?: () => void;
};

export const StandardExternalLinkWithTracking: FC<StandardExternalLinkWithTrackingProps> = ({
    children,
    href,
    onClick,
    target,
    rel,
    className,
}) => {
    const { effects } = useStandardExternalLinkWithTrackingStore(onClick);
    const { onTrack } = effects;

    return (
        <a href={href} onClick={onTrack} className={className} target={target} rel={rel}>
            {children}
        </a>
    );
};
