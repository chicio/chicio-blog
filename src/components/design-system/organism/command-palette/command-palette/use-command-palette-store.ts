"use client";

import {
    commandPaletteCloseEvent,
    commandPaletteOpenEvent,
} from "@/components/design-system/state/command-palette/command-palette-events";
import type { ComponentStore } from "@/types/component-store";
import { useCallback, useEffect, useState } from "react";

interface CommandPaletteState {
    open: boolean;
}

interface CommandPaletteEffects {
    close: () => void;
    stopPropagation: (e: React.MouseEvent) => void;
    handleQueryChange: (value: string) => void;
}

export const useCommandPaletteStore = (
    onOpenChange?: (open: boolean) => void,
    onQueryChange?: (query: string) => void,
): ComponentStore<CommandPaletteState, CommandPaletteEffects> => {
    const [open, setOpen] = useState(false);

    const changeOpen = useCallback(
        (next: boolean) => {
            setOpen(next);
            onOpenChange?.(next);
        },
        [onOpenChange],
    );

    const close = useCallback(() => changeOpen(false), [changeOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((previous) => {
                    onOpenChange?.(!previous);

                    return !previous;
                });
            }
        };
        const handleOpenEvent = () => changeOpen(true);
        const handleCloseEvent = () => changeOpen(false);

        window.addEventListener("keydown", handleKeyDown, true);
        window.addEventListener(commandPaletteOpenEvent, handleOpenEvent);
        window.addEventListener(commandPaletteCloseEvent, handleCloseEvent);

        return () => {
            window.removeEventListener("keydown", handleKeyDown, true);
            window.removeEventListener(commandPaletteOpenEvent, handleOpenEvent);
            window.removeEventListener(commandPaletteCloseEvent, handleCloseEvent);
        };
    }, [changeOpen, onOpenChange]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                close();
            }
        };

        window.addEventListener("keydown", handleEsc, true);

        return () => window.removeEventListener("keydown", handleEsc, true);
    }, [open, close]);

    const stopPropagation = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

    const handleQueryChange = useCallback(
        (value: string) => {
            onQueryChange?.(value.trim());
        },
        [onQueryChange],
    );

    return {
        state: { open },
        effects: { close, stopPropagation, handleQueryChange },
    };
};
