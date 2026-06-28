"use client";

import { FC, ReactNode } from "react";
import Link from "next/link";
import { useMenuItemStore } from "./use-menu-item-store";

export type MenuItemProps = {
    to: string;
    selected: boolean;
    children?: ReactNode;
    className?: string;
    onClick?: () => void;
    external?: boolean;
};

export const MenuItem: FC<MenuItemProps> = ({
    children,
    className,
    to,
    selected,
    onClick,
    external,
}) => {
    const { effects } = useMenuItemStore();
    const { handleClick } = effects;

    const color = selected ? "text-accent" : "text-primary-text";
    const spacing = "px-2 py-2 xs:px-6 xs:py-1";
    const text = "text-sm md:text-base text-shadow-md text-center no-underline";
    const transition = "transition-all duration-300";
    const border = `border border-solid rounded-xl ${selected ? "border-accent" : "border-transparent"}`;
    const flex = "flex items-center justify-center";
    const background = selected ? "bg-accent-alpha-15" : "transparent";
    const hover = `hover:bg-accent-alpha-10 hover:text-accent hover:border-accent hover:transition-all hover:duration-300 hover:translate-y-[-1px] hover:shadow-lg`;
    const composedClassName = `relative ${transition} ${color} ${spacing} ${text} ${border} ${flex} ${background} ${hover}${className ? ` ${className}` : ""}`;

    if (external) {
        return (
            <a
                href={to}
                target="_blank"
                rel="noopener noreferrer"
                className={composedClassName}
                onClick={handleClick(onClick)}
            >
                {children}
            </a>
        );
    }

    return (
        <Link
            href={to}
            prefetch={false}
            className={composedClassName}
            onClick={handleClick(onClick)}
        >
            {children}
        </Link>
    );
};
