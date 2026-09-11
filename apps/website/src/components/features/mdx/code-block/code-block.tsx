"use client";

import { FC, ReactNode } from "react";
import { CopyCodeButton } from "./copy-code-button";
import { useCodeBlockStore } from "./use-code-block-store";

interface CodeBlockProps {
    children?: ReactNode;
    className?: string;
    [key: string]: unknown;
}

export const CodeBlock: FC<CodeBlockProps> = ({ children, className, ...rest }) => {
    const { state, effects } = useCodeBlockStore();
    const { getText } = state;
    const { setPreEl } = effects;

    return (
        <div id="code-block" className="group relative my-4 flex flex-col sm:block">
            <pre ref={setPreEl} className={className} {...rest}>
                {children}
            </pre>
            <div className="flex justify-end px-2 py-1.5 sm:contents">
                <CopyCodeButton getText={getText} />
            </div>
        </div>
    );
};
