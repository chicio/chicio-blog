"use client";

import { FC, useState } from "react";
import { CopiedIcon, CopyErrorIcon, CopyIcon } from "../../atoms/icons/copy-icon";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { Button } from "../../atoms/buttons/button";
import { useClipboardAvailable } from "../../utils/hooks/use-clipboard-available";

interface CopyCodeButtonProps {
    getText: () => string;
}

export const CopyCodeButton: FC<CopyCodeButtonProps> = ({ getText }) => {
    const [copied, setCopied] = useState(false);
    const [copyError, setCopyError] = useState(false);
    const clipboardAvailable = useClipboardAvailable();

    if (!clipboardAvailable) {
        return null;
    }

    const handleCopy = async () => {
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
            setCopyError(true);
            setTimeout(() => {
                setCopyError(false);
            }, 2000);
        }
    };

    return (
        <Button
            onClick={handleCopy}
            aria-label={copied ? "Copied!" : copyError ? "Copy failed" : "Copy code"}
            className={`
                text-primary!
                sm:absolute sm:top-2 sm:right-2
                ${copied
                    ? "text-primary"
                    : copyError
                        ? "border-confirm text-confirm" : ""
                }
            `}
        >
            {copied ? <CopiedIcon /> : copyError ? <CopyErrorIcon /> : <CopyIcon />}
        </Button>
    );
};
