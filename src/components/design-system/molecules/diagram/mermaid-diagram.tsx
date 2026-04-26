"use client";

import { FC, useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
    definition: string;
}

mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: {
        primaryColor: "#001100",
        primaryTextColor: "#E8FFE8",
        primaryBorderColor: "#00FF41",
        lineColor: "#00CC33",
        secondaryColor: "#001800",
        tertiaryColor: "#000D00",
        background: "#001100",
        mainBkg: "#001100",
        nodeBorder: "#00FF41",
        clusterBkg: "#001800",
        titleColor: "#E8FFE8",
        edgeLabelBackground: "#001100",
        attributeBackgroundColorEven: "#001100",
        attributeBackgroundColorOdd: "#001800",
    },
    flowchart: {
        htmlLabels: true,
    },
});

export const MermaidDiagram: FC<MermaidDiagramProps> = ({ definition }) => {
    const id = useId().replace(/:/g, "");
    const diagramId = `mermaid-${id}`;
    const containerRef = useRef<HTMLDivElement>(null);
    const [rendered, setRendered] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        mermaid
            .render(diagramId, definition)
            .then(({ svg }) => {
                if (containerRef.current) {
                    containerRef.current.innerHTML = svg;
                    setRendered(true);
                }
            })
            .catch(() => {
                setError("Failed to render diagram");
            });
    }, [definition, diagramId]);

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
