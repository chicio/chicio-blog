"use client";

import { CommandPaletteItem, TerminalLine } from "matrix-design-system";
import { BiTerminal } from "react-icons/bi";
import { FC } from "react";

export interface TerminalItemProps {
    onSelect: () => void;
}

export const TerminalItem: FC<TerminalItemProps> = ({ onSelect }) => (
    <CommandPaletteItem value="open terminal" onSelect={onSelect}>
        <TerminalLine>
            <BiTerminal className="mr-2 mb-0.5 inline" />
            {">"} Open terminal
        </TerminalLine>
    </CommandPaletteItem>
);
