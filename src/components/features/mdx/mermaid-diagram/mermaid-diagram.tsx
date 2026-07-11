"use client";

import { FC } from "react";
import { useMermaidDiagramStore } from "./use-mermaid-diagram-store";

interface MermaidDiagramProps {
    definition: string;
}

export const MermaidDiagram: FC<MermaidDiagramProps> = ({ definition }) => {
    const { state, effects } = useMermaidDiagramStore(definition);
    const { rendered, error } = state;
    const { setContainerEl } = effects;

    return (
        <div className="relative my-4 overflow-x-auto rounded border border-[#00FF41]/40 bg-[#001100] p-4 shadow-[0_0_12px_#00FF4120]">
            {!rendered && !error && (
                <div className="flex h-24 items-center justify-center">
                    <span className="font-mono text-sm text-[#00CC33]">Rendering diagram...</span>
                </div>
            )}
            {error && (
                <div className="flex h-24 items-center justify-center">
                    <span className="font-mono text-sm text-red-400">{error}</span>
                </div>
            )}
            <div
                ref={setContainerEl}
                className="flex justify-center [&_svg]:max-w-full [&_svg]:h-auto [&_.nodeLabel]:text-center [&_.nodeLabel_p]:text-center"
                aria-label="Mermaid diagram"
            />
        </div>
    );
};
