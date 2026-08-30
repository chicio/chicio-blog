"use client";

import { TerminalLine } from "../../../atoms/typography/terminal-blocks";
import { CommandPaletteItem } from "../command-palette-item";
import { MdAnimation, MdDoDisturb } from "react-icons/md";
import { FC } from "react";
import { useToggleMotionItemStore } from "./use-toggle-motion-item-store";

export interface ToggleMotionItemProps {
    onTrack?: () => void;
}

export const ToggleMotionItem: FC<ToggleMotionItemProps> = ({ onTrack }) => {
    const { state, effects } = useToggleMotionItemStore(onTrack);
    const { motionEnabled } = state;
    const { handleToggleMotion } = effects;

    return (
        <CommandPaletteItem value="toggle animations motion" onSelect={handleToggleMotion} closeOnSelect={false}>
            <TerminalLine>
                {motionEnabled ? (
                    <MdDoDisturb className="mr-2 mb-0.5 inline" />
                ) : (
                    <MdAnimation className="mr-2 mb-0.5 inline" />
                )}
                {">"} Toggle Animations{" "}
                <span className="text-accent/60 ml-1 font-mono text-xs">[{motionEnabled ? "ON" : "OFF"}]</span>
            </TerminalLine>
        </CommandPaletteItem>
    );
};
