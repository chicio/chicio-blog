"use client";

import { useEffect, useState } from "react";
import { loadMermaid, nextMermaidId } from "./mermaid-loader";
import type { ComponentStore } from "@/types/component-store";

interface MermaidDiagramState {
    rendered: boolean;
    error: string | null;
}

interface MermaidDiagramEffects {
    setContainerEl: (el: HTMLDivElement | null) => void;
}

export const useMermaidDiagramStore = (definition: string): ComponentStore<MermaidDiagramState, MermaidDiagramEffects> => {
    const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
    const [rendered, setRendered] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!containerEl) {
            return;
        }

        loadMermaid()
            .then((mermaid) => mermaid.render(nextMermaidId(), definition))
            .then(({ svg }) => {
                containerEl.innerHTML = svg;
                setRendered(true);
            })
            .catch(() => {
                setError("Failed to render diagram");
            });

        return () => {
            containerEl.innerHTML = "";
        };
    }, [containerEl, definition]);

    return {
        state: { rendered, error },
        effects: { setContainerEl },
    };
};
