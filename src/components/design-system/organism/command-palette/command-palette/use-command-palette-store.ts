"use client";

import { useSearch } from "@/components/design-system/hooks/use-search";
import { commandPaletteOpenEvent } from "@/lib/command-palette/command-palette-events";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { slugs } from "@/types/configuration/slug";
import { EasterEggTerminalLines, SearchResult } from "@/types/search/search";
import { ComponentType, ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ComponentStore } from "@/types/component-store";

const noopEasterEgg = (_query: string): SearchResult | null => null;

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
    handleSearchResultSelect: (slug: string) => void;
    setSelectedValue: (value: string) => void;
}

export const useCommandPaletteStore = (
    searchEasterEgg: (query: string) => SearchResult | null = noopEasterEgg,
    SearchEasterEggComponent?: ComponentType<{ lines: EasterEggTerminalLines }>,
): ComponentStore<CommandPaletteState, CommandPaletteEffects> => {
    const [open, setOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedValue, setSelectedValue] = useState("open ai chat");
    const { handleSearch, resetSearch, search } = useSearch(open, searchEasterEgg);
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
            trackWith({
                category: tracking.category.command_palette,
                label: tracking.label.header,
                action: tracking.action.command_palette_open,
            });
        };

        window.addEventListener("keydown", handleKeyDown, true);
        window.addEventListener(commandPaletteOpenEvent, handleOpenEvent);

        return () => {
            window.removeEventListener("keydown", handleKeyDown, true);
            window.removeEventListener(commandPaletteOpenEvent, handleOpenEvent);
        };
    }, []);

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

    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    const handleSearchInput = (value: string) => {
        setIsSearching(value.trim().length >= 3);
        handleSearch({ target: { value } } as ChangeEvent<HTMLInputElement>);
    };

    const handleOpenChat = () => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_open_chat,
        });
        router.push(slugs.chat);
        close();
    };

    const handleSearchResultSelect = (slug: string) => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_search_result_selected,
        });
        router.push(slug);
        close();
    };

    const easterEggLines =
        search.type === "easterEgg" && SearchEasterEggComponent ? search.terminalLines : null;

    return {
        state: { open, isSearching, selectedValue, search, easterEggLines },
        effects: { close, stopPropagation, handleSearchInput, handleOpenChat, handleSearchResultSelect, setSelectedValue },
    };
};
