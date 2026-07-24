"use client";

import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { FC } from "react";
import { TerminalPrompt } from "./terminal-prompt";
import { TerminalScrollback } from "./terminal-scrollback";
import { useTerminalStore } from "./use-terminal-store";

export const Terminal: FC = () => {
    const { state, effects } = useTerminalStore();
    const { open, lines, cwd, input, completions, announcement } = state;
    const {
        setInputElement,
        setScrollAnchorElement,
        handleInputChange,
        handleKeyDown,
        handleSubmit,
        handleCompletionSelect,
        closeOverlay,
        stopPropagation,
    } = effects;

    if (!open) {
        return null;
    }

    return (
        <Overlay delay={0} onClick={closeOverlay} className="z-50 bg-black!">
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Terminal"
                onClick={stopPropagation}
                className="fixed inset-0 flex flex-col sm:inset-4"
            >
                <div className="border-accent-alpha-40 bg-general-background flex h-full flex-1 flex-col overflow-hidden rounded-xl border border-solid shadow-lg">
                    <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0 overflow-hidden">
                        <defs>
                            <filter id="terminal-phosphor" colorInterpolationFilters="sRGB">
                                <feColorMatrix
                                    type="matrix"
                                    values="0.2126 0.7152 0.0722 0 0
                                            0.2126 0.7152 0.0722 0 0
                                            0.2126 0.7152 0.0722 0 0
                                            0      0      0      1 0"
                                />
                                <feComponentTransfer>
                                    <feFuncR type="table" tableValues="0.02 0.224" />
                                    <feFuncG type="table" tableValues="0.05 1" />
                                    <feFuncB type="table" tableValues="0.02 0.078" />
                                </feComponentTransfer>
                            </filter>
                        </defs>
                    </svg>
                    <TerminalScrollback lines={lines} setScrollAnchorElement={setScrollAnchorElement} />
                    <TerminalPrompt
                        cwd={cwd}
                        input={input}
                        completions={completions}
                        setInputElement={setInputElement}
                        handleInputChange={handleInputChange}
                        handleKeyDown={handleKeyDown}
                        handleSubmit={handleSubmit}
                        handleCompletionSelect={handleCompletionSelect}
                    />
                    <div className="border-accent/20 text-accent/40 border-t px-4 py-2 font-mono text-xs">
                        <span>take the blue pill (`close` or esc) to wake up</span>
                    </div>
                </div>
                <span aria-live="polite" className="sr-only">
                    {announcement}
                </span>
            </div>
        </Overlay>
    );
};
