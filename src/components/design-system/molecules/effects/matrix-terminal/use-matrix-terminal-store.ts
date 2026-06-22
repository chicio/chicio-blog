"use client";

import { useEffect } from "react";
import { useInView } from "@/components/design-system/hooks/use-in-view";
import { useTypewriter } from "@/components/design-system/hooks/use-typewriter";
import { StateStore } from "@/types/component-store";
import React from "react";

interface TerminalLine {
    text: string;
    type?: "normal" | "error" | "success" | "quote";
    delay?: number;
}

interface MatrixTerminalState {
    containerRef: React.RefObject<HTMLDivElement | null>;
    completedLines: TerminalLine[];
    currentLine: TerminalLine | null;
    currentText: string;
}

export const useMatrixTerminalStore = (
    lines: TerminalLine[],
    onComplete?: () => void
): StateStore<MatrixTerminalState> => {
    const [containerRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
    const { completedLines, currentLine, currentText } = useTypewriter(lines, 50, isInView);

    useEffect(() => {
        if (completedLines.length === lines.length && !currentLine && onComplete) {
            onComplete();
        }
    }, [completedLines.length, currentLine, lines.length, onComplete]);

    return { state: { containerRef, completedLines, currentLine, currentText } };
};
