"use client";

import { FC, ReactNode, useCallback, useRef } from "react";
import { CopyCodeButton } from "./copy-code-button";

interface CodeBlockProps {
    children?: ReactNode;
    className?: string;
    [key: string]: unknown;
}

export const CodeBlock: FC<CodeBlockProps> = ({ children, className, ...rest }) => {
    const preRef = useRef<HTMLPreElement>(null);
    const getText = useCallback(() => preRef.current?.textContent ?? "", []);

    return (
        <div id="code-block" className="relative group flex flex-col sm:block">
            <pre ref={preRef} className={className} {...rest}>
                {children}
            </pre>
            <div className="flex justify-end px-2 py-1.5 sm:contents">
                <CopyCodeButton getText={getText} />
            </div>
        </div>
    );
};
