"use client";

import { ChangeEvent, useCallback, useState, useTransition } from "react";
import { Content } from "@/types/content/content";
import { ConsoleMetadata, GameMetadata } from "@/types/content/videogames";

export type ConsoleWithGameCount = {
    console: Content<ConsoleMetadata>;
    gamesCount: number;
};

export const useGamesFilter = (
    games: Content<GameMetadata>[],
    consolesWithGameCount: ConsoleWithGameCount[],
) => {
    const [query, setQuery] = useState("");
    const [filteredGames, setFilteredGames] = useState(games);
    const [filteredConsoles, setFilteredConsoles] = useState(consolesWithGameCount);
    const [isPending, startTransition] = useTransition();

    const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        startTransition(() => {
            const lower = value.toLowerCase();
            setFilteredGames(games.filter((g) => g.frontmatter.title.toLowerCase().includes(lower)));
            setFilteredConsoles(
                consolesWithGameCount.filter((console) =>
                    (console.console.frontmatter.metadata?.name ?? "").toLowerCase().includes(lower),
                ),
            );
        });
    };

    const resetFilter = useCallback(() => {
        setQuery("");
        startTransition(() => {
            setFilteredGames(games);
            setFilteredConsoles(consolesWithGameCount);
        });
    }, [games, consolesWithGameCount]);

    return { query, filteredGames, filteredConsoles, handleFilter, resetFilter, isPending };
};
