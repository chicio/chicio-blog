"use client";

import { Command } from "cmdk";
import { FC, ReactNode } from "react";
import { useCommandPaletteItemStore } from "./use-command-palette-item-store";

const ITEM_CLASS =
    "px-4 py-2 cursor-pointer aria-selected:bg-accent-alpha-10 aria-selected:border-l-2 aria-selected:border-accent transition-colors duration-100";

export interface CommandPaletteItemProps {
    value: string;
    onSelect?: () => void;
    closeOnSelect?: boolean;
    children: ReactNode;
}

export const CommandPaletteItem: FC<CommandPaletteItemProps> = ({
    value,
    onSelect,
    closeOnSelect = true,
    children,
}) => {
    const { effects } = useCommandPaletteItemStore(onSelect, closeOnSelect);
    const { handleSelect } = effects;

    return (
        <Command.Item value={value} className={ITEM_CLASS} onSelect={handleSelect}>
            {children}
        </Command.Item>
    );
};
