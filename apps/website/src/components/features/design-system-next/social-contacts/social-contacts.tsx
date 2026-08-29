import { FC } from "react";
import {
    SocialContacts as DesignSystemSocialContacts,
    type SocialContactsProps,
} from "@/components/design-system/organism/social-contacts";
import { NextLink } from "@/components/features/design-system-next/next-link";

export type { SocialContactsProps };

/** SocialContacts bound to next/link. See design-system-next/next-link for the prefetch mapping. */
export const SocialContacts: FC<Omit<SocialContactsProps, "linkComponent">> = (props) => (
    <DesignSystemSocialContacts {...props} linkComponent={NextLink} />
);
