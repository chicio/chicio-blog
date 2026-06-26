"use client";

import { FC, ReactNode } from "react";
import { useCallToActionExternalWithTrackingStore } from "./use-call-to-action-external-with-tracking-store";

type CallToActionExternalWithTrackingProps = {
    href: string;
    className?: string;
    target?: string;
    rel?: string;
    children?: ReactNode;
    onClick?: () => void;
};

export const CallToActionExternalWithTracking: FC<CallToActionExternalWithTrackingProps> = ({
    children,
    className,
    href,
    onClick,
    target,
    rel,
}) => {
    const { effects } = useCallToActionExternalWithTrackingStore(onClick);
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
