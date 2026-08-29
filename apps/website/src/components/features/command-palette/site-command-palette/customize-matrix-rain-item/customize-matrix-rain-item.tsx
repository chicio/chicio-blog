"use client";

import { CommandPaletteItem, TerminalLine } from "matrix-design-system";
import { MdTune } from "react-icons/md";
import { FC } from "react";
import { useCustomizeMatrixRainItemStore } from "./use-customize-matrix-rain-item-store";

export interface CustomizeMatrixRainItemProps {
    onTrack?: () => void;
}

export const CustomizeMatrixRainItem: FC<CustomizeMatrixRainItemProps> = ({ onTrack }) => {
    const { state, effects } = useCustomizeMatrixRainItemStore(onTrack);
    const { visible } = state;
    const { handleSelect } = effects;

    if (!visible) {
        return null;
    }

    return (
        <CommandPaletteItem value="customize matrix rain" onSelect={handleSelect}>
            <TerminalLine>
                <MdTune className="mr-2 mb-0.5 inline" />
                {">"} Customize Matrix Rain
            </TerminalLine>
        </CommandPaletteItem>
    );
};
