"use client";

import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { FC } from "react";
import { TerminalPrompt } from "./terminal-prompt";
import { TerminalScrollback } from "./terminal-scrollback";
import { useTerminalStore } from "./use-terminal-store";

export const Terminal: FC = () => {
    const { glassmorphismClass } = useGlassmorphism({ noScale: true });
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
        <Overlay delay={0} onClick={closeOverlay} className="z-50">
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Terminal"
                onClick={stopPropagation}
                className="fixed inset-0 flex flex-col sm:inset-4"
            >
                <div className={`${glassmorphismClass} flex h-full flex-1 flex-col overflow-hidden`}>
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
                        <span>type `close` or press esc to exit</span>
                    </div>
                </div>
                <span aria-live="polite" className="sr-only">
                    {announcement}
                </span>
            </div>
        </Overlay>
    );
};
