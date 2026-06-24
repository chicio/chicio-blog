"use client";

import { Command } from "cmdk";
import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { MdDoDisturb, MdAnimation } from "react-icons/md";
import { useToggleMotionItemStore } from "./use-toggle-motion-item-store";

const ITEM_CLASS =
    "px-4 py-2 cursor-pointer aria-selected:bg-accent-alpha-10 aria-selected:border-l-2 aria-selected:border-accent transition-colors duration-100";

export const ToggleMotionItem = () => {
    const { state, effects } = useToggleMotionItemStore();
    const { motionEnabled } = state;
    const { handleToggleMotion } = effects;

    return (
        <Command.Item value="toggle animations motion" className={ITEM_CLASS} onSelect={handleToggleMotion}>
            <TerminalLine>
                {motionEnabled ? (
                    <MdDoDisturb className="inline mr-2 mb-0.5" />
                ) : (
                    <MdAnimation className="inline mr-2 mb-0.5" />
                )}
                {">"} Toggle Animations{" "}
                <span className="ml-1 text-accent/60 font-mono text-xs">[{motionEnabled ? "ON" : "OFF"}]</span>
            </TerminalLine>
        </Command.Item>
    );
};
