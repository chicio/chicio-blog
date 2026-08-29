import { FC } from "react";
import {
    BluePillLink as DesignSystemBluePillLink,
    RedPillLink as DesignSystemRedPillLink,
    type PillProps,
} from "@/components/design-system/molecules/links/pills-links";
import { NextLink } from "@/components/features/design-system-next/next-link";

export type { PillProps };

type BoundPillProps = Omit<PillProps, "linkComponent">;

/** Pill links bound to next/link. See design-system-next/next-link for the prefetch mapping. */
export const RedPillLink: FC<BoundPillProps> = (props) => (
    <DesignSystemRedPillLink {...props} linkComponent={NextLink} />
);

export const BluePillLink: FC<BoundPillProps> = (props) => (
    <DesignSystemBluePillLink {...props} linkComponent={NextLink} />
);
