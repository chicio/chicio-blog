"use client";

import Link from "next/link";
import { FC, ReactNode } from "react";

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
    return (
        <Link
            className={`call-to-action${className ? ` ${className}` : ""}`}
            href={to}
            prefetch={prefetch}
            onClick={onClick}
        >
            {children}
        </Link>
    );
};
