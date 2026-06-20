"use client";

import { ChangeEvent, useCallback, useState, useTransition } from "react";
import { ComponentStore } from "@/types/component-store";
import { Content } from "@/types/content/content";
import { ConsoleMetadata, GameMetadata } from "@/types/content/videogames";
import { useVideogamesViewStore } from "@/components/content/videogames/use-videogames-view-store";
import { VideogamesView, writeVideogamesView } from "@/lib/videogames/videogames-view";

export type ConsoleWithGameCount = {
    console: Content<ConsoleMetadata>;
    gamesCount: number;
};

interface VideogamesViewSwitcherState {
    activeView: VideogamesView | null;
    query: string;
    filteredGames: Content<GameMetadata>[];
    filteredConsoles: ConsoleWithGameCount[];
    isPending: boolean;
}

interface VideogamesViewSwitcherEffects {
    handleFilter: (e: ChangeEvent<HTMLInputElement>) => void;
    handleViewChange: (view: VideogamesView) => void;
}

export const useVideogamesViewSwitcherStore = (
    games: Content<GameMetadata>[],
    consolesWithGameCount: ConsoleWithGameCount[],
): ComponentStore<VideogamesViewSwitcherState, VideogamesViewSwitcherEffects> => {
    const activeView = useVideogamesViewStore();
    const [query, setQuery] = useState("");
    const [filteredGames, setFilteredGames] = useState(games);
    const [filteredConsoles, setFilteredConsoles] = useState(consolesWithGameCount);
    const [isPending, startTransition] = useTransition();

    const handleFilter = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setQuery(value);
            startTransition(() => {
                const lower = value.toLowerCase();
                setFilteredGames(games.filter((g) => g.frontmatter.title.toLowerCase().includes(lower)));
                setFilteredConsoles(
                    consolesWithGameCount.filter((c) =>
                        (c.console.frontmatter.metadata?.name ?? "").toLowerCase().includes(lower),
                    ),
                );
            });
        },
        [games, consolesWithGameCount],
    );

    const handleViewChange = useCallback(
        (view: VideogamesView) => {
            setQuery("");
            startTransition(() => {
                setFilteredGames(games);
                setFilteredConsoles(consolesWithGameCount);
            });
            writeVideogamesView(view);
        },
        [games, consolesWithGameCount],
    );

    return {
        state: { activeView, query, filteredGames, filteredConsoles, isPending },
        effects: { handleFilter, handleViewChange },
    };
};
