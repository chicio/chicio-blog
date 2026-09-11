"use client";

import { AnimatePresence } from "framer-motion";
import { FC } from "react";
import { BiChevronDown } from "react-icons/bi";
import { MenuItem } from "../menu-item";
import type { LinkComponent } from "../../../atoms/links/anchor-link";
import { useDropdownMenuStore } from "./use-dropdown-menu-store";

interface DropdownMenuItem {
    label: string;
    to: string;
    selected?: boolean;
    onClick?: () => void;
    external?: boolean;
}

interface DropdownMenuGroup {
    label: string;
    items: DropdownMenuItem[];
}

export interface DropdownMenuProps {
    linkComponent?: LinkComponent;
    label: string;
    items: DropdownMenuGroup[];
    className?: string;
    chevronClassName?: string;
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
    label,
    items,
    className = "",
    chevronClassName = "",
    linkComponent,
}) => {
    const hasSelected = items.flatMap((group) => group.items).some((item) => item.selected);
    const { state, effects } = useDropdownMenuStore(hasSelected);
    const { open, selected, shouldReduceMotions, buttonRef, panelId } = state;
    const { toggleOpen, handleBlur, handleKeyDown, getGroupId } = effects;

    return (
        <div className="relative z-50 mb-0" tabIndex={-1} onBlur={handleBlur} onKeyDown={handleKeyDown}>
            <button
                ref={buttonRef}
                className={`${className} xs:pl-4 xs:pr-1 xs:py-1 hover:bg-accent-alpha-10 hover:text-accent hover:border-accent relative flex flex-nowrap items-center justify-center gap-2 rounded-xl border border-solid px-1 py-2 text-center text-sm leading-normal text-shadow-md md:text-base ${open || selected ? "border-accent bg-accent-alpha-15 text-accent" : "border-transparent"}`}
                aria-expanded={open}
                aria-controls={open ? panelId : undefined}
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
                    <ul
                        key="dropdown-menu"
                        id={panelId}
                        aria-label={label}
                        role="list"
                        className={`glow-container ${shouldReduceMotions ? "xs:bg-general-background" : "xs:bg-general-background/90"} xs:absolute xs:right-0 xs:left-0 xs:w-60 relative m-0 mt-2 min-w-max list-none rounded-xl p-0 py-2`}
                        tabIndex={-1}
                    >
                        {items.map((group, idx) => {
                            const groupId = getGroupId(idx);
                            return (
                                <li key={group.label + idx} className="mb-0 pl-0 before:content-none">
                                    {idx > 0 && (
                                        <div aria-hidden="true" className="border-secondary-text/30 mx-3 border-t" />
                                    )}
                                    <span
                                        id={groupId}
                                        className="text-secondary-text block cursor-default px-4 pt-3 pb-1 text-sm font-bold tracking-wider uppercase select-none"
                                    >
                                        {group.label}
                                    </span>
                                    <ul aria-labelledby={groupId} role="list" className="m-0 list-none p-0">
                                        {group.items.map((item, itemIdx) => (
                                            <li key={item.label + itemIdx} className="mb-0 pl-0 before:content-none">
                                                <MenuItem
                                                    linkComponent={linkComponent}
                                                    to={item.to}
                                                    selected={item.selected ?? false}
                                                    className="xs:whitespace-nowrap m-2 text-center"
                                                    onClick={item.onClick}
                                                    external={item.external}
                                                >
                                                    {item.label}
                                                </MenuItem>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </AnimatePresence>
        </div>
    );
};
