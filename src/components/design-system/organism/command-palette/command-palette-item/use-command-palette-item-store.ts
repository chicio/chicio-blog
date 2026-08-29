"use client";

import { closeCommandPalette } from "@/components/design-system/state/command-palette/command-palette-events";
import type { EffectsStore } from "@/types/component-store";
import { useCallback } from "react";

interface CommandPaletteItemEffects {
    handleSelect: () => void;
}

export const useCommandPaletteItemStore = (
    onSelect: (() => void) | undefined,
    closeOnSelect: boolean,
): EffectsStore<CommandPaletteItemEffects> => {
    const handleSelect = useCallback(() => {
        onSelect?.();

        if (closeOnSelect) {
            closeCommandPalette();
        }
    }, [onSelect, closeOnSelect]);

    return { effects: { handleSelect } };
};
