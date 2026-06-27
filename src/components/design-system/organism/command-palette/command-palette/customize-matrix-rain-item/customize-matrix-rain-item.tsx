"use client";

import { Command } from "cmdk";
import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { MdTune } from "react-icons/md";
import { useCustomizeMatrixRainItemStore } from "./use-customize-matrix-rain-item-store";

const ITEM_CLASS =
    "px-4 py-2 cursor-pointer aria-selected:bg-accent-alpha-10 aria-selected:border-l-2 aria-selected:border-accent transition-colors duration-100";

interface CustomizeMatrixRainItemProps {
    onClose: () => void;
    onTrack?: () => void;
}

export const CustomizeMatrixRainItem = ({ onClose, onTrack }: CustomizeMatrixRainItemProps) => {
    const { state, effects } = useCustomizeMatrixRainItemStore(onClose, onTrack);
    const { visible } = state;
    const { handleSelect } = effects;

    if (!visible) {
        return null;
    }

    return (
        <Command.Item value="customize matrix rain" className={ITEM_CLASS} onSelect={handleSelect}>
            <TerminalLine>
                <MdTune className="inline mr-2 mb-0.5" />
                {">"} Customize Matrix Rain
            </TerminalLine>
        </Command.Item>
    );
};
