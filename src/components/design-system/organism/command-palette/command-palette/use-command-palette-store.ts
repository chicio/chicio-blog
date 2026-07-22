"use client";

import { useSearch } from "@/components/design-system/hooks/use-search";
import { commandPaletteOpenEvent } from "@/components/design-system/state/command-palette/command-palette-events";
import type { EasterEggTerminalLines, SearchResult } from "@/types/search/search";
import { ComponentType, ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ComponentStore } from "@/types/component-store";

const noopEasterEgg = (): SearchResult | null => null;

interface CommandPaletteState {
    open: boolean;
    isSearching: boolean;
    selectedValue: string;
    search: SearchResult;
    easterEggLines: EasterEggTerminalLines | null;
}

interface CommandPaletteEffects {
    close: () => void;
    stopPropagation: (e: React.MouseEvent) => void;
    handleSearchInput: (value: string) => void;
    handleOpenChat: () => void;
    handleOpenEasterEggHunt: () => void;
    handleOpenTerminal: () => void;
    handleSearchResultSelect: (slug: string) => void;
    setSelectedValue: (value: string) => void;
    onToggleMotion?: () => void;
    handleCustomizeMatrixRainClose: () => void;
}

interface CommandPaletteTrackingCallbacks {
    onOpen?: () => void;
    onOpenChat?: () => void;
    onSearchResultSelect?: () => void;
    onToggleMotion?: () => void;
    onCustomizeMatrixRain?: () => void;
    onOpenEasterEggHunt?: () => void;
    onOpenTerminal?: () => void;
}

export const useCommandPaletteStore = (
    searchIndexFileName: string,
    chatSlug: string,
    easterEggHuntSlug: string,
    terminalSlug: string,
    tracking?: CommandPaletteTrackingCallbacks,
    searchEasterEgg: (query: string) => SearchResult | null = noopEasterEgg,
    SearchEasterEggComponent?: ComponentType<{ lines: EasterEggTerminalLines }>,
): ComponentStore<CommandPaletteState, CommandPaletteEffects> => {
    const [open, setOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedValue, setSelectedValue] = useState("open ai chat");
    const { handleSearch, resetSearch, search } = useSearch(open, searchEasterEgg, searchIndexFileName);
    const [previousSearch, setPreviousSearch] = useState(search);
    const router = useRouter();

    if (previousSearch !== search) {
        setPreviousSearch(search);
        setSelectedValue(
            search.type === "search" && search.results.length > 0 ? search.results[0].title : "open ai chat",
        );
    }

    const close = useCallback(() => {
        setOpen(false);
        setIsSearching(false);
        resetSearch();
    }, [resetSearch]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        const handleOpenEvent = () => {
            setOpen(true);
            tracking?.onOpen?.();
        };

        window.addEventListener("keydown", handleKeyDown, true);
        window.addEventListener(commandPaletteOpenEvent, handleOpenEvent);

        return () => {
            window.removeEventListener("keydown", handleKeyDown, true);
            window.removeEventListener(commandPaletteOpenEvent, handleOpenEvent);
        };
    }, [tracking]);

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

    const handleSearchInput = useCallback(
        (value: string) => {
            setIsSearching(value.trim().length >= 3);
            handleSearch({ target: { value } } as ChangeEvent<HTMLInputElement>);
        },
        [handleSearch],
    );

    const handleOpenChat = useCallback(() => {
        tracking?.onOpenChat?.();
        router.push(chatSlug);
        close();
    }, [tracking, router, chatSlug, close]);

    const handleOpenEasterEggHunt = useCallback(() => {
        tracking?.onOpenEasterEggHunt?.();
        router.push(easterEggHuntSlug);
        close();
    }, [tracking, router, easterEggHuntSlug, close]);

    const handleOpenTerminal = useCallback(() => {
        tracking?.onOpenTerminal?.();
        router.push(terminalSlug);
        close();
    }, [tracking, router, terminalSlug, close]);

    const handleSearchResultSelect = useCallback(
        (slug: string) => {
            tracking?.onSearchResultSelect?.();
            router.push(slug);
            close();
        },
        [tracking, router, close],
    );

    const easterEggLines =
        search.type === "easterEgg" && SearchEasterEggComponent ? search.terminalLines : null;

    const handleCustomizeMatrixRainClose = useCallback(() => {
        tracking?.onCustomizeMatrixRain?.();
        close();
    }, [tracking, close]);

    return {
        state: { open, isSearching, selectedValue, search, easterEggLines },
        effects: {
            close,
            stopPropagation,
            handleSearchInput,
            handleOpenChat,
            handleOpenEasterEggHunt,
            handleOpenTerminal,
            handleSearchResultSelect,
            setSelectedValue,
            onToggleMotion: tracking?.onToggleMotion,
            handleCustomizeMatrixRainClose,
        },
    };
};
