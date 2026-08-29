"use client";

import {
    Cursor,
    ErrorText,
    QuoteText,
    SuccessText,
    TerminalLine,
    TerminalQuoteLine,
} from "@/components/design-system/atoms/typography/terminal-blocks";
import { FC } from "react";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { MotionDiv } from "@/components/design-system/atoms/animation/motion-div";
import { useMatrixTerminalStore } from "./use-matrix-terminal-store";

interface TerminalLineData {
    text: string;
    type?: "normal" | "error" | "success" | "quote";
    delay?: number;
}

interface MatrixTerminalProps {
    lines: TerminalLineData[];
    onComplete?: () => void;
    widthClassName?: string;
}

const renderLineContent = (text: string, type?: "normal" | "error" | "success" | "quote") => {
    switch (type) {
        case "error":
            return <ErrorText>{text}</ErrorText>;
        case "success":
            return <SuccessText>{text}</SuccessText>;
        case "quote":
            return <QuoteText>{text}</QuoteText>;
        default:
            return text;
    }
};

const renderLine = (
    line: TerminalLineData,
    text: string,
    showCursor: boolean,
    index: number
) => {
    if (line.type === "quote") {
        return (
            <TerminalQuoteLine key={`line-${index}`}>
                {renderLineContent(text, line.type)}
            </TerminalQuoteLine>
        );
    }

    return (
        <TerminalLine key={`line-${index}`}>
            <span>{">"} </span>
            {renderLineContent(text, line.type)}
            {showCursor && <Cursor />}
        </TerminalLine>
    );
};

export const MatrixTerminal: FC<MatrixTerminalProps> = ({
    lines,
    onComplete,
    widthClassName = "w-[95%] sm:w-[600px]",
}) => {
    const { state } = useMatrixTerminalStore(lines, onComplete);
    const { containerRef, completedLines, currentLine, currentText } = state;
    const { glassmorphismClass } = useGlassmorphism();

    return (
        <div ref={containerRef}>
            <MotionDiv
                className={`${glassmorphismClass} ${widthClassName} p-4 min-h-[150px] sm:min-h-[200px]`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            >
                {completedLines.map((line, index) => renderLine(line, line.text, false, index))}
                {currentLine && renderLine(currentLine, currentText, true, completedLines.length)}
            </MotionDiv>
        </div>
    );
};
