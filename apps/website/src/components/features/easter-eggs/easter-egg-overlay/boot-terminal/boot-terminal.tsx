"use client";

import { FC } from "react";
import { Cursor, TerminalLine } from "matrix-design-system";
import type { EasterEggSlug } from "@/lib/easter-eggs/easter-egg-catalog";
import { useBootTerminalStore } from "./use-boot-terminal-store";

interface BootTerminalProps {
    slug: EasterEggSlug;
    reducedMotion: boolean;
    skipSignal: number;
    onBootComplete: () => void;
}

export const BootTerminal: FC<BootTerminalProps> = ({ slug, reducedMotion, skipSignal, onBootComplete }) => {
    const { state } = useBootTerminalStore(slug, reducedMotion, skipSignal, onBootComplete);
    const { completedLines, activeLine, bootComplete } = state;

    return (
        <div className="min-h-24">
            {completedLines.map((line, index) => (
                <TerminalLine key={`${slug}-boot-${index}`}>{line}</TerminalLine>
            ))}
            {!bootComplete && (
                <TerminalLine>
                    {activeLine}
                    <Cursor />
                </TerminalLine>
            )}
        </div>
    );
};
