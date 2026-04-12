"use client";

import { FC, useCallback, useState } from "react";
import { CopiedIcon, CopyIcon } from "../../atoms/icons/copy-icon";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";

interface CopyCodeButtonProps {
    getText: () => string;
}

export const CopyCodeButton: FC<CopyCodeButtonProps> = ({ getText }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        const text = getText();

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            trackWith({
                action: tracking.action.copy_code_block,
                category: tracking.category.blog_post,
                label: tracking.label.body,
            });
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            // Clipboard API not available — silently ignore
        }
    }, [getText]);

    return (
        <button
            onClick={handleCopy}
            aria-label={copied ? "Copied!" : "Copy code"}
            className={`
                absolute top-2 right-2
                p-1.5 rounded-lg
                border border-solid transition-all duration-300
                cursor-pointer bg-general-background-alpha-60 backdrop-blur-sm
                ${copied
                    ? "border-primary text-primary"
                    : "border-accent-alpha-40 text-accent hover:border-accent hover:text-accent hover:scale-110"
                }
            `}
        >
            {copied ? <CopiedIcon /> : <CopyIcon />}
        </button>
    );
};
