import type { Mermaid } from "mermaid";

let instance: Promise<Mermaid> | null = null;
let renderCounter = 0;

export const nextMermaidId = (): string => `mermaid-${++renderCounter}`;

export const loadMermaid = (): Promise<Mermaid> => {
    if (!instance) {
        instance = import("mermaid").then(({ default: mermaid }) => {
            mermaid.initialize({
                startOnLoad: false,
                theme: "base",
                themeVariables: {
                    primaryColor: "#002a00",
                    primaryTextColor: "#E8FFE8",
                    primaryBorderColor: "#00FF41",
                    lineColor: "#00CC33",
                    secondaryColor: "#003300",
                    tertiaryColor: "#001a00",
                    background: "transparent",
                    mainBkg: "#002a00",
                    nodeBorder: "#00FF41",
                    clusterBkg: "#052e05",
                    clusterBorder: "#00CC33",
                    titleColor: "#E8FFE8",
                    edgeLabelBackground: "#001100",
                    attributeBackgroundColorEven: "#002a00",
                    attributeBackgroundColorOdd: "#003300",
                },
                themeCSS: ".cluster-label .nodeLabel { font-weight: 700; font-size: 1.15em; color: #00FF41; }",
                flowchart: {
                    htmlLabels: true,
                },
            });
            return mermaid;
        });
    }
    return instance;
};
