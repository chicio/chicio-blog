"use client";

import { FC, PropsWithChildren } from "react";
import { BluePill, RedPill } from "@/components/design-system/atoms/effects/pills";
import { InternalLink } from "@/components/design-system/atoms/links/internal-link";

type PillProps = PropsWithChildren<{
    to: string;
    onClick?: () => void;
}>;

export const RedPillLink: FC<PillProps> = ({ children, to, onClick }) => (
    <InternalLink className="no-underline" to={to} onClick={onClick}>
        <RedPill>{children}</RedPill>
    </InternalLink>
);

export const BluePillLink: FC<PillProps> = ({ children, to, onClick }) => (
    <InternalLink className="no-underline" to={to} onClick={onClick}>
        <BluePill>{children}</BluePill>
    </InternalLink>
);
