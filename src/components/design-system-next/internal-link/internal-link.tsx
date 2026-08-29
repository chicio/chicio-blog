import { FC } from "react";
import { InternalLink as DesignSystemInternalLink, type InternalLinkProps } from "@/components/design-system/atoms/links/internal-link";
import { NextLink } from "@/components/design-system-next/next-link";

export type { InternalLinkProps };

/** InternalLink bound to next/link. See design-system-next/next-link for the prefetch mapping. */
export const InternalLink: FC<Omit<InternalLinkProps, "linkComponent">> = (props) => (
    <DesignSystemInternalLink {...props} linkComponent={NextLink} />
);
