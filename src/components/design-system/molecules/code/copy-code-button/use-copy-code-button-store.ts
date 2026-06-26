"use client";

import { useState, useCallback } from "react";
import { useClipboardAvailable } from "@/components/design-system/hooks/use-clipboard-available";
import { ComponentStore } from "@/types/component-store";

interface CopyCodeButtonState {
    copied: boolean;
    copyError: boolean;
    clipboardAvailable: boolean;
}

interface CopyCodeButtonEffects {
    handleCopy: (getText: () => string) => () => Promise<void>;
}

export const useCopyCodeButtonStore = (
    onCopy?: () => void,
): ComponentStore<CopyCodeButtonState, CopyCodeButtonEffects> => {
    const [copied, setCopied] = useState(false);
    const [copyError, setCopyError] = useState(false);
    const clipboardAvailable = useClipboardAvailable();

    const handleCopy = useCallback(
        (getText: () => string) => async () => {
            const text = getText();

            try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                onCopy?.();
                setTimeout(() => {
                    setCopied(false);
                }, 2000);
            } catch {
                setCopyError(true);
                setTimeout(() => {
                    setCopyError(false);
                }, 2000);
            }
        },
        [onCopy],
    );

    return {
        state: { copied, copyError, clipboardAvailable },
        effects: { handleCopy },
    };
};
