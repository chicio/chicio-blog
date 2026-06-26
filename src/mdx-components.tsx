import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/design-system/molecules/code/code-block";
import { MermaidDiagram } from "@/components/design-system/molecules/diagram/mermaid-diagram";
import { extractMermaidDefinition } from "./lib/mermaid/mermaid";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";

const trackCopyCodeBlock = () => {
    trackWith({
        action: tracking.action.copy_code_block,
        category: tracking.category.blog_post,
        label: tracking.label.body,
    });
};

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

        return <CodeBlock {...props} onCopy={trackCopyCodeBlock} />;
    },
    // eslint-disable-next-line @next/next/no-img-element
    img: ({ alt, ...props }) => <img loading="lazy" decoding="async" alt={alt ?? ""} {...props} />,
};

export function useMDXComponents(): MDXComponents {
    return components;
}
