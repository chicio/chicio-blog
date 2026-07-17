"use client";

import { Command } from "cmdk";
import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { GiRabbit } from "react-icons/gi";

const ITEM_CLASS =
    "px-4 py-2 cursor-pointer aria-selected:bg-accent-alpha-10 aria-selected:border-l-2 aria-selected:border-accent transition-colors duration-100";

interface EasterEggHuntItemProps {
    onSelect: () => void;
}

export const EasterEggHuntItem = ({ onSelect }: EasterEggHuntItemProps) => (
    <Command.Item value="easter egg hunt" className={ITEM_CLASS} onSelect={onSelect}>
        <TerminalLine>
            <GiRabbit className="mr-2 mb-0.5 inline" />
            {">"} Easter Egg Hunt
        </TerminalLine>
    </Command.Item>
);
