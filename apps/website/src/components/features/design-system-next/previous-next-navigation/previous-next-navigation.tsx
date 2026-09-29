import { FC } from "react";
import {
    PreviousNextNavigation as DesignSystemPreviousNextNavigation,
    type PreviousNextNavigationProps,
} from "matrix-design-system";
import { NextLink } from "@/components/features/design-system-next/next-link";

export type { PreviousNextNavigationProps };

/** PreviousNextNavigation bound to next/link. See design-system-next/next-link for the prefetch mapping. */
export const PreviousNextNavigation: FC<Omit<PreviousNextNavigationProps, "linkComponent">> = (props) => (
    <DesignSystemPreviousNextNavigation {...props} linkComponent={NextLink} />
);
