import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/design-system/molecules/code/code-block";
import { MermaidDiagram } from "@/components/design-system/molecules/diagram/mermaid-diagram";
import { extractMermaidDefinition } from "./lib/mermaid/mermaid";

const components: MDXComponents = {
    table: (props) => (
        <div className="table-wrapper">
            <table {...props} />
        </div>
    ),
    pre: (props) => {
        const mermaidDefinition = extractMermaidDefinition(props.children);

        if (mermaidDefinition) {
            return <MermaidDiagram definition={mermaidDefinition} />;
        }

        return <CodeBlock {...props} />;
    },
};

export function useMDXComponents(): MDXComponents {
    return components;
}