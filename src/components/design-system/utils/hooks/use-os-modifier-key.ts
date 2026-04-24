import { useState, useEffect } from "react";

export type OsModifierKey = "meta" | "ctrl";

/**
 * Detects the OS-specific keyboard modifier key for shortcuts.
 * Returns null during SSR and before hydration to avoid mismatches.
 * - "meta"  → macOS / iPadOS (⌘ Command)
 * - "ctrl"  → Windows / Linux (Ctrl)
 */
export const useOsModifierKey = (): OsModifierKey | null => {
    const [modifierKey, setModifierKey] = useState<OsModifierKey | null>(null);

    useEffect(() => {
        const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
        setModifierKey(isMac ? "meta" : "ctrl");
    }, []);

    return modifierKey;
};
