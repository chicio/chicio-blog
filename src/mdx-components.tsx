import type { MDXComponents } from "mdx/types";
import { MermaidDiagram } from "@/components/design-system/molecules/diagram/mermaid-diagram";
import { extractMermaidDefinition } from "./lib/mermaid/mermaid";
import { TrackedCodeBlock } from "@/components/features/mdx/tracked-code-block";

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

        return <TrackedCodeBlock {...props} />;
    },
    // eslint-disable-next-line @next/next/no-img-element
    img: ({ alt, ...props }) => <img loading="lazy" decoding="async" alt={alt ?? ""} {...props} />,
};

export function useMDXComponents(): MDXComponents {
    return components;
}
