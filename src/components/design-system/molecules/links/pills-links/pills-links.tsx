"use client";

import { FC, PropsWithChildren } from "react";
import { BluePill, RedPill } from "@/components/design-system/atoms/effects/pills";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";

type PillProps = PropsWithChildren<{
    to: string;
    onClick?: () => void;
}>;

export const RedPillLink: FC<PillProps> = ({ children, to, onClick }) => (
    <StandardInternalLinkWithTracking className="no-underline" to={to} onClick={onClick}>
        <RedPill>{children}</RedPill>
    </StandardInternalLinkWithTracking>
);

export const BluePillLink: FC<PillProps> = ({ children, to, onClick }) => (
    <StandardInternalLinkWithTracking className="no-underline" to={to} onClick={onClick}>
        <BluePill>{children}</BluePill>
    </StandardInternalLinkWithTracking>
);
