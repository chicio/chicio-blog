import { ErrorText, SuccessText, TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import type { TerminalScrollbackEntry } from "@/lib/terminal/terminal-screen-lines";
import { TerminalContentBlock } from "./terminal-content-block";
import { FC } from "react";

export interface TerminalScrollbackProps {
    lines: TerminalScrollbackEntry[];
    setScrollAnchorElement: (el: HTMLDivElement | null) => void;
}

const renderLine = (entry: TerminalScrollbackEntry) => {
    if (entry.kind === "content") {
        return <TerminalContentBlock key={entry.id} {...entry} />;
    }

    if (entry.kind === "prompt") {
        return <TerminalLine key={entry.id}>{entry.text}</TerminalLine>;
    }

    const content =
        entry.kind === "error" ? (
            <ErrorText>{entry.text}</ErrorText>
        ) : entry.kind === "success" ? (
            <SuccessText>{entry.text}</SuccessText>
        ) : (
            entry.text
        );

    return (
        <div
            key={entry.id}
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
