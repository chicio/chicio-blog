"use client";

import { FC } from "react";
import { Menu } from "@/components/features/design-system-next/menu";
import { useSiteMenuStore } from "./use-site-menu-store";

interface SiteMenuProps {
    trackingCategory: string;
}

/**
 * The tracked site menu for pages that do not sit on a Content Page (the homepage and the chat). It owns the
 * tracking callbacks so that a server component can render it without passing functions across the server boundary.
 */
export const SiteMenu: FC<SiteMenuProps> = ({ trackingCategory }) => {
    const { state } = useSiteMenuStore(trackingCategory);

    return <Menu entries={state.entries} />;
};
