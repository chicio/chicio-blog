"use client";

import { FC, ReactNode } from "react";
import { CopyCodeButton } from "@/components/design-system/molecules/code/copy-code-button";
import { useCodeBlockStore } from "./use-code-block-store";

interface CodeBlockProps {
    children?: ReactNode;
    className?: string;
    onCopy?: () => void;
    [key: string]: unknown;
}

export const CodeBlock: FC<CodeBlockProps> = ({ children, className, onCopy, ...rest }) => {
    const { state, effects } = useCodeBlockStore();
    const { getText } = state;
    const { setPreEl } = effects;

    return (
        <div id="code-block" className="relative group flex flex-col sm:block my-4">
            <pre ref={setPreEl} className={className} {...rest}>
                {children}
            </pre>
            <div className="flex justify-end px-2 py-1.5 sm:contents">
                <CopyCodeButton getText={getText} onCopy={onCopy} />
            </div>
        </div>
    );
};
