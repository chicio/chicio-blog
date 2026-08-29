"use client";

import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { CommandPaletteItem } from "@/components/design-system/organism/command-palette";
import { SiCoderabbit } from "react-icons/si";
import { FC } from "react";

export interface EasterEggHuntItemProps {
    onSelect: () => void;
}

export const EasterEggHuntItem: FC<EasterEggHuntItemProps> = ({ onSelect }) => (
    <CommandPaletteItem value="easter egg hunt" onSelect={onSelect}>
        <TerminalLine>
            <SiCoderabbit className="mr-2 mb-0.5 inline" />
            {">"} Easter Egg Hunt
        </TerminalLine>
    </CommandPaletteItem>
);
