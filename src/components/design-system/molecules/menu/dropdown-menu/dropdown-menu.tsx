"use client";

import { AnimatePresence } from "framer-motion";
import { FC } from "react";
import { BiChevronDown } from "react-icons/bi";
import { MenuItem } from "@/components/design-system/molecules/menu/menu-item";
import { useDropdownMenuStore } from "./use-dropdown-menu-store";

interface DropdownMenuItem {
    label: string;
    to: string;
    onTrack?: () => void;
    selected?: boolean;
    onClick?: () => void;
    external?: boolean;
}

interface DropdownMenuGroup {
    label: string;
    items: DropdownMenuItem[];
}

type DropdownMenuEntry = DropdownMenuItem | DropdownMenuGroup;

const isDropdownMenuGroup = (entry: DropdownMenuEntry): entry is DropdownMenuGroup =>
    "items" in entry;

interface DropdownMenuProps {
    label: string;
    items: DropdownMenuEntry[];
    className?: string;
    chevronClassName?: string;
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
    label,
    items,
    className = "",
    chevronClassName = "",
}) => {
    const hasSelected = items
        .flatMap((entry) => (isDropdownMenuGroup(entry) ? entry.items : [entry]))
        .some((item) => item.selected);
    const { state, effects } = useDropdownMenuStore(hasSelected);
    const { open, selected, shouldReduceMotions, buttonRef } = state;
    const { toggleOpen, handleBlur, handleItemClick } = effects;

    return (
        <div className="relative z-50 mb-0" tabIndex={-1} onBlur={handleBlur}>
            <button
                ref={buttonRef}
                className={`${className} xs:pl-4 xs:pr-1 xs:py-1 hover:bg-accent-alpha-10 hover:text-accent hover:border-accent relative flex flex-nowrap items-center justify-center gap-2 rounded-xl border border-solid px-1 py-2 text-center text-sm leading-normal text-shadow-md md:text-base ${open || selected ? "border-accent bg-accent-alpha-15 text-accent" : "border-transparent"}`}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={toggleOpen}
                type="button"
            >
                <span>{label}</span>
                <BiChevronDown
                    className={`text-matrix-green transition-transform duration-200 ${chevronClassName} ${open ? "rotate-180" : "rotate-0"}`}
                    size={20}
                />
            </button>
            <AnimatePresence>
                {open && (
                    <div
                        key="dropdown-menu"
                        className={`glow-container ${shouldReduceMotions ? "xs:bg-general-background" : "xs:bg-general-background/90"} relative mt-2 w-auto min-w-max rounded-xl py-2 xs:absolute xs:right-0 xs:left-0 xs:w-auto`}
                        tabIndex={-1}
                        role="menu"
                    >
                        {items.map((entry, idx) =>
                            isDropdownMenuGroup(entry) ? (
                                <div key={entry.label + idx}>
                                    {idx > 0 && (
                                        <div className="border-secondary-text/30 mx-3 border-t" />
                                    )}
                                    <span className="text-secondary-text block px-4 pt-3 pb-1 text-sm font-bold uppercase tracking-wider cursor-default select-none">
                                        {entry.label}
                                    </span>
                                    {entry.items.map((item, itemIdx) => (
                                        <MenuItem
                                            key={item.label + itemIdx}
                                            to={item.to}
                                            onTrack={item.onTrack}
                                            selected={item.selected ?? false}
                                            className="xs:whitespace-nowrap m-2 text-center"
                                            onClick={handleItemClick(item.onClick)}
                                            external={item.external}
                                        >
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </div>
                            ) : (
                                <MenuItem
                                    key={entry.label + idx}
                                    to={entry.to}
                                    onTrack={entry.onTrack}
                                    selected={entry.selected ?? false}
                                    className="xs:whitespace-nowrap m-2"
                                    onClick={handleItemClick(entry.onClick)}
                                    external={entry.external}
                                >
                                    {entry.label}
                                </MenuItem>
                            )
                        )}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
