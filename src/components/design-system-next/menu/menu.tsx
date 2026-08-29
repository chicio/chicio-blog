"use client";

import { FC } from "react";
import { Menu as DesignSystemMenu, type MenuProps } from "@/components/design-system/organism/menu";
import { NextLink } from "@/components/design-system-next/next-link";
import { useMenuStore } from "./use-menu-store";

export type { MenuProps };

/**
 * Menu bound to next/link and to Next's router. The design system takes the active path as a prop
 * rather than reading it from a router it should not know about.
 */
export const Menu: FC<Omit<MenuProps, "linkComponent" | "currentPath">> = (props) => {
    const { state } = useMenuStore();
    const { currentPath } = state;

    return <DesignSystemMenu {...props} currentPath={currentPath} linkComponent={NextLink} />;
};
