"use client";

import { Command } from "cmdk";
import { FC, ReactNode } from "react";

export interface CommandPaletteGroupProps {
    label?: string;
    children: ReactNode;
}

export const CommandPaletteGroup: FC<CommandPaletteGroupProps> = ({ label, children }) => (
    <Command.Group>
        {label && <div className="text-accent/50 px-4 py-1 font-mono text-xs tracking-wider uppercase">{label}</div>}
        {children}
    </Command.Group>
);
