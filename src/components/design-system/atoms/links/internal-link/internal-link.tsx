"use client";

import Link from "next/link";
import { FC, ReactNode } from "react";

type InternalLinkProps = {
    to: string;
    className?: string;
    children?: ReactNode;
    prefetch?: boolean;
    onClick?: () => void;
};

export const InternalLink: FC<InternalLinkProps> = ({
    children,
    className,
    to,
    onClick,
    prefetch = false,
}) => {
    return (
        <Link className={className} href={to} prefetch={prefetch} onClick={onClick}>
            {children}
        </Link>
    );
};
