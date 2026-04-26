import { Children, isValidElement, ReactNode } from "react";

export const extractMermaidDefinition = (children: ReactNode): string | null => {
    const firstChild = Children.toArray(children)[0];

    if (isValidElement(firstChild)) {
        const childProps = firstChild.props as Record<string, unknown>;
        const className = typeof childProps.className === "string" ? childProps.className : "";

        if (className.includes("language-mermaid") && typeof childProps.children === "string") {
            return childProps.children.trim();
        }
    }

    return null;
}