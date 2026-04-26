import type { MDXComponents } from "mdx/types";
import { Children, isValidElement } from "react";
import { CodeBlock } from "@/components/design-system/molecules/code/code-block";
import { MermaidDiagramDynamic } from "@/components/design-system/molecules/diagram/mermaid-diagram-dynamic";

function extractTextContent(node: unknown): string {
    if (typeof node === "string") {
        return node;
    }
    if (Array.isArray(node)) {
        return node.map(extractTextContent).join("");
    }
    if (isValidElement(node) && node.props) {
        return extractTextContent((node.props as Record<string, unknown>).children);
    }
    return "";
}

const components: MDXComponents = {
    table: (props) => (
        <div className="table-wrapper">
            <table {...props} />
        </div>
    ),
    pre: (props) => {
        const children = Children.toArray(props.children);
        const firstChild = children[0];

        if (isValidElement(firstChild)) {
            const childProps = firstChild.props as Record<string, unknown>;
            const className = typeof childProps.className === "string" ? childProps.className : "";

            if (className.includes("language-mermaid")) {
                const definition = extractTextContent(childProps.children).trim();
                return <MermaidDiagramDynamic definition={definition} />;
            }
        }

        return <CodeBlock {...props} />;
    },
};

export function useMDXComponents(): MDXComponents {
    return components;
}
