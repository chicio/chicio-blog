import { FC } from "react";
import { Breadcrumb as DesignSystemBreadcrumb, type BreadcrumbProps } from "matrix-design-system";
import { NextLink } from "@/components/features/design-system-next/next-link";

export type { BreadcrumbProps };

/** Breadcrumb bound to next/link. See design-system-next/next-link for the prefetch mapping. */
export const Breadcrumb: FC<Omit<BreadcrumbProps, "linkComponent">> = (props) => (
    <DesignSystemBreadcrumb {...props} linkComponent={NextLink} />
);
