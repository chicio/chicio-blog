"use client";

import { FC } from "react";
import { Button, CopiedIcon, CopyErrorIcon, CopyIcon } from "matrix-design-system";
import { useCopyCodeButtonStore } from "./use-copy-code-button-store";

interface CopyCodeButtonProps {
    getText: () => string;
}

export const CopyCodeButton: FC<CopyCodeButtonProps> = ({ getText }) => {
    const { state, effects } = useCopyCodeButtonStore();
    const { copied, copyError, clipboardAvailable } = state;
    const { handleCopy } = effects;

    if (!clipboardAvailable) {
        return null;
    }

    return (
        <Button
            onClick={handleCopy(getText)}
            aria-label={copied ? "Copied!" : copyError ? "Copy failed" : "Copy code"}
            className={`
                text-primary!
                sm:absolute sm:top-2 sm:right-2
                ${copied ? "text-primary" : copyError ? "border-confirm text-confirm" : ""}
            `}
        >
            {copied ? <CopiedIcon /> : copyError ? <CopyErrorIcon /> : <CopyIcon />}
        </Button>
    );
};
