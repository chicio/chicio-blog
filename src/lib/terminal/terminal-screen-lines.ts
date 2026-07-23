import type { TerminalContentBlockData, TerminalOutputLine } from "@/types/terminal/terminal";

export interface TerminalScreenLine {
    id: string;
    text: string;
    kind: "prompt" | "normal" | "error" | "success";
}

export type TerminalScrollbackEntry = TerminalScreenLine | TerminalContentBlockData;

export const toScreenLines = (outputLines: TerminalOutputLine[], startIndex: number): TerminalScreenLine[] =>
    outputLines.map((line, index) => ({
        id: `line-${startIndex + index}`,
        text: line.text,
        kind: line.kind ?? "normal",
    }));
