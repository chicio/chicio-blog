import { FC } from "react";
import { Footer as DesignSystemFooter, type FooterProps } from "@/components/design-system/organism/footer";
import { NextLink } from "@/components/features/design-system-next/next-link";

export type { FooterProps };

/** Footer bound to next/link. See design-system-next/next-link for the prefetch mapping. */
export const Footer: FC<Omit<FooterProps, "linkComponent">> = (props) => (
    <DesignSystemFooter {...props} linkComponent={NextLink} />
);
