"use client";

import { AnchorLink, type LinkComponent } from "../../links/anchor-link";
import { FC, ReactNode } from "react";

export type CallToActionInternalWithTrackingProps = {
    to: string;
    linkComponent?: LinkComponent;
    className?: string;
    children?: ReactNode;
    onClick?: () => void;
};

export const CallToActionInternalWithTracking: FC<CallToActionInternalWithTrackingProps> = ({
    children,
    className,
    to,
    onClick,
    linkComponent: Link = AnchorLink,
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
