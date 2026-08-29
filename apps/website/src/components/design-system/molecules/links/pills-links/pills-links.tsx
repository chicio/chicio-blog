"use client";

import { FC, PropsWithChildren } from "react";
import { BluePill, RedPill } from "@/components/design-system/atoms/effects/pills";
import { InternalLink } from "@/components/design-system/atoms/links/internal-link";
import type { LinkComponent } from "@/components/design-system/atoms/links/anchor-link";

export type PillProps = PropsWithChildren<{
    to: string;
    onClick?: () => void;
    linkComponent?: LinkComponent;
}>;

export const RedPillLink: FC<PillProps> = ({ children, to, onClick, linkComponent }) => (
    <InternalLink linkComponent={linkComponent} className="no-underline" to={to} onClick={onClick}>
        <RedPill>{children}</RedPill>
    </InternalLink>
);

export const BluePillLink: FC<PillProps> = ({ children, to, onClick, linkComponent }) => (
    <InternalLink linkComponent={linkComponent} className="no-underline" to={to} onClick={onClick}>
        <BluePill>{children}</BluePill>
    </InternalLink>
);
