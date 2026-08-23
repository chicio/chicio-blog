"use client";

import Link from "next/link";
import { FC, ReactNode } from "react";

type CallToActionInternalWithTrackingProps = {
    to: string;
    className?: string;
    children?: ReactNode;
    onClick?: () => void;
};

export const CallToActionInternalWithTracking: FC<CallToActionInternalWithTrackingProps> = ({
    children,
    className,
    to,
    onClick,
}) => {
    return (
        <Link
            className={`call-to-action${className ? ` ${className}` : ""}`}
            href={to}
            onClick={onClick}
        >
            {children}
        </Link>
    );
};
