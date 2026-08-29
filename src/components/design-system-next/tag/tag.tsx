import { FC } from "react";
import { Tag as DesignSystemTag, type TagProps } from "@/components/design-system/molecules/buttons/tag";
import { NextLink } from "@/components/design-system-next/next-link";

export type { TagProps };

/** Tag bound to next/link. See design-system-next/next-link for the prefetch mapping. */
export const Tag: FC<Omit<TagProps, "linkComponent">> = (props) => (
    <DesignSystemTag {...props} linkComponent={NextLink} />
);
