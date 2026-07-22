"use client";

import { Command } from "cmdk";
import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { BiTerminal } from "react-icons/bi";

const ITEM_CLASS =
    "px-4 py-2 cursor-pointer aria-selected:bg-accent-alpha-10 aria-selected:border-l-2 aria-selected:border-accent transition-colors duration-100";

interface TerminalItemProps {
    onSelect: () => void;
}

export const TerminalItem = ({ onSelect }: TerminalItemProps) => (
    <Command.Item value="open terminal" className={ITEM_CLASS} onSelect={onSelect}>
        <TerminalLine>
            <BiTerminal className="mr-2 mb-0.5 inline" />
            {">"} Open terminal
        </TerminalLine>
    </Command.Item>
);
