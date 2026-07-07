"use client";

import { FC, ReactNode } from "react";

type ExternalLinkProps = {
    href: string;
    target?: string;
    rel?: string;
    children?: ReactNode;
    className?: string;
    onClick?: () => void;
};

export const ExternalLink: FC<ExternalLinkProps> = ({
    children,
    href,
    onClick,
    target,
    rel,
    className,
}) => {
    return (
        <a href={href} onClick={onClick} className={className} target={target} rel={rel}>
            {children}
        </a>
    );
};
