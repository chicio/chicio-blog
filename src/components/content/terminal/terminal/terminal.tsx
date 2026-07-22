"use client";

import { TerminalIcon } from "@/components/design-system/atoms/icons/terminal-icon";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { ContentContainer } from "@/components/design-system/molecules/containers/content-container";
import { GenericHeader } from "@/components/design-system/organism/header/generic-header";
import { Menu } from "@/components/design-system/organism/menu";
import { menuNavHrefs } from "@/components/features/content/nav-config";
import { FC } from "react";
import { TerminalPrompt } from "./terminal-prompt";
import { TerminalScrollback } from "./terminal-scrollback";
import { useTerminalStore } from "./use-terminal-store";

export const Terminal: FC = () => {
    const { glassmorphismClass } = useGlassmorphism({ noScale: true });
    const { state, effects } = useTerminalStore();
    const { lines, cwd, input, completions, announcement, hasRunCommands } = state;
    const {
        setInputElement,
        setScrollAnchorElement,
        handleInputChange,
        handleKeyDown,
        handleSubmit,
        handleCompletionSelect,
    } = effects;

    return (
        <>
            <Menu navHrefs={menuNavHrefs} />
            <ContentContainer>
                <main>
                    <GenericHeader
                        title="Terminal"
                        subtitle="Navigate fabrizioduroni.it like a Unix shell"
                        logo={<TerminalIcon />}
                        visible={!hasRunCommands}
                    />
                    <div className={`${glassmorphismClass} flex h-[60vh] min-h-[420px] flex-col overflow-hidden`}>
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
                    </div>
                    <span aria-live="polite" className="sr-only">
                        {announcement}
                    </span>
                </main>
            </ContentContainer>
        </>
    );
};
