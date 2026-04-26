"use client";

import { FC, useEffect, useRef, useState } from "react";
import { loadMermaid, nextMermaidId } from "../../utils/loader/mermaid-loader";

interface MermaidDiagramProps {
    definition: string;
}

export const MermaidDiagram: FC<MermaidDiagramProps> = ({ definition }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [rendered, setRendered] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        loadMermaid()
            .then((mermaid) => mermaid.render(nextMermaidId(), definition))
            .then(({ svg }) => {
                container.innerHTML = svg;
                setRendered(true);
            })
            .catch(() => {
                setError("Failed to render diagram");
            });

        return () => {
            container.innerHTML = "";
        };
    }, [definition]);

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
                ref={containerRef}
                className="flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
                aria-label="Mermaid diagram"
            />
        </div>
    );
};
