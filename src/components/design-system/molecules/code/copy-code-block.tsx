"use client";

import { FC, ReactNode, useCallback } from "react";
import { CopyCodeButton } from "./copy-code-button";

function extractTextFromReactNode(node: ReactNode): string {
    if (typeof node === "string") {
        return node;
    }
    if (typeof node === "number" || typeof node === "boolean") {
        return String(node);
    }
    if (node === null || node === undefined) {
        return "";
    }
    if (Array.isArray(node)) {
        return node.map(extractTextFromReactNode).join("");
    }
    if (typeof node === "object" && "props" in node) {
        const element = node as React.ReactElement<{ children?: ReactNode }>;
        return extractTextFromReactNode(element.props.children);
    }
    return "";
}

interface CopyCodeBlockProps {
    children?: ReactNode;
    className?: string;
    [key: string]: unknown;
}

export const CopyCodeBlock: FC<CopyCodeBlockProps> = ({ children, className, ...rest }) => {
    const getText = useCallback(() => extractTextFromReactNode(children), [children]);

    return (
        <div className="relative group">
            <pre className={className} {...rest}>
                {children}
            </pre>
            <CopyCodeButton getText={getText} />
        </div>
    );
};
