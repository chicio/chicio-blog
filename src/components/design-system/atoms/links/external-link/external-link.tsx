"use client";

import { FC, ReactNode } from "react";
import { useExternalLinkStore } from "./use-external-link-store";

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
    const { effects } = useExternalLinkStore(onClick);
    const { onTrack } = effects;

    return (
        <a href={href} onClick={onTrack} className={className} target={target} rel={rel}>
            {children}
        </a>
    );
};
