"use client";

import dynamic from "next/dynamic";

export const MermaidDiagramDynamic = dynamic(
    () => import("./mermaid-diagram").then((mod) => mod.MermaidDiagram),
    { ssr: false },
);
