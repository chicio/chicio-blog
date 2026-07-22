import { ErrorText, SuccessText, TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import type { TerminalScreenLine } from "@/lib/terminal/terminal-screen-lines";
import { FC } from "react";

export interface TerminalScrollbackProps {
    lines: TerminalScreenLine[];
    setScrollAnchorElement: (el: HTMLDivElement | null) => void;
}

const renderLine = (line: TerminalScreenLine) => {
    if (line.kind === "prompt") {
        return <TerminalLine key={line.id}>{line.text}</TerminalLine>;
    }

    const content =
        line.kind === "error" ? (
            <ErrorText>{line.text}</ErrorText>
        ) : line.kind === "success" ? (
            <SuccessText>{line.text}</SuccessText>
        ) : (
            line.text
        );

    return (
        <div
            key={line.id}
            className="text-primary-text/80 mb-1 font-mono text-xs leading-tight break-words whitespace-pre-wrap sm:text-sm"
        >
            {content}
        </div>
    );
};

export const TerminalScrollback: FC<TerminalScrollbackProps> = ({ lines, setScrollAnchorElement }) => (
    <div className="hide-scrollbar flex-1 overflow-y-auto px-4 py-3">
        {lines.map(renderLine)}
        <div ref={setScrollAnchorElement} />
    </div>
);
