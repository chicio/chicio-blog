"use client";

import { FC, PropsWithChildren } from "react";
import { BluePill, RedPill } from "../../../atoms/effects/pills";
import { InternalLink } from "../../../atoms/links/internal-link";
import type { LinkComponent } from "../../../atoms/links/anchor-link";

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
