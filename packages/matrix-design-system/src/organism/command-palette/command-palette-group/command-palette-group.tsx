"use client";

import { Command } from "cmdk";
import { FC, ReactNode } from "react";

const HEADING_CLASS =
    "[&_[cmdk-group-heading]]:text-accent/50 [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:uppercase";

export interface CommandPaletteGroupProps {
    label?: string;
    children: ReactNode;
}

export const CommandPaletteGroup: FC<CommandPaletteGroupProps> = ({ label, children }) => (
    <Command.Group heading={label} className={HEADING_CLASS}>
        {children}
    </Command.Group>
);
