"use client";

import { FC, ReactNode } from "react";

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
    return (
        <a
            className={`call-to-action${className ? ` ${className}` : ""}`}
            href={href}
            onClick={onClick}
            target={target}
            rel={rel}
        >
            {children}
        </a>
    );
};
