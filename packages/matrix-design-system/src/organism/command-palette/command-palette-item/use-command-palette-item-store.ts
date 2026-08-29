"use client";

import { CommandPaletteContext } from "../../../state/command-palette/command-palette-context";
import type { EffectsStore } from "matrix-component-store";
import { useCallback, useContext } from "react";

interface CommandPaletteItemEffects {
    handleSelect: () => void;
}

export const useCommandPaletteItemStore = (
    onSelect: (() => void) | undefined,
    closeOnSelect: boolean,
): EffectsStore<CommandPaletteItemEffects> => {
    const closePalette = useContext(CommandPaletteContext);

    const handleSelect = useCallback(() => {
        onSelect?.();

        if (closeOnSelect) {
            closePalette?.();
        }
    }, [onSelect, closeOnSelect, closePalette]);

    return { effects: { handleSelect } };
};
