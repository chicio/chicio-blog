import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/features/mdx/code-block";
import { MermaidDiagram } from "@/components/features/mdx/mermaid-diagram";
import { LightboxImage } from "@/components/design-system/molecules/lightbox-image";
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
    img: LightboxImage,
};

export function useMDXComponents(): MDXComponents {
    return components;
}
