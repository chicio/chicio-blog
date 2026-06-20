"use client";

import { memo } from "react";
import { Content } from "@/types/content/content";
import { GameMetadata } from "@/types/content/videogames";
import { SegmentedControl, SegmentOption } from "@/components/design-system/molecules/buttons/segmented-control";
import { GamesGrid } from "@/components/content/videogames/games-grid";
import { IoGameControllerOutline } from "react-icons/io5";
import { GiGameConsole } from "react-icons/gi";
import { VideogamesView } from "@/lib/videogames/videogames-view";
import { ConsoleCard } from "./console-card";
import { GamesFilter } from "./games-filter";
import { ConsoleWithGameCount, useVideogamesViewSwitcherStore } from "./use-videogames-view-switcher-store";

const FilteredGameGrid = memo(
    ({ games, query }: { games: Content<GameMetadata>[]; query: string; isPending: boolean }) =>
        games.length > 0 ? (
            <GamesGrid games={games} navigationOrigin="all-games" />
        ) : (
            <div className="text-secondary flex flex-col items-center gap-3 py-16">
                <IoGameControllerOutline className="text-accent text-shadow-lg size-12" />
                <p className="text-accent text-shadow-lg">No games found for &ldquo;{query}&rdquo;.</p>
            </div>
        ),
    (_, next) => next.isPending,
);
FilteredGameGrid.displayName = "FilteredGameGrid";

const FilteredConsoleList = memo(
    ({
        consolesWithGameCount,
        query,
    }: {
        consolesWithGameCount: ConsoleWithGameCount[];
        query: string;
        isPending: boolean;
    }) =>
        consolesWithGameCount.length > 0 ? (
            <div className="flex flex-col gap-6">
                {consolesWithGameCount.map(({ console, gamesCount }) => (
                    <ConsoleCard console={console} gamesCount={gamesCount} key={console.frontmatter.metadata?.name} />
                ))}
            </div>
        ) : (
            <div className="text-secondary flex flex-col items-center gap-3 py-16">
                <GiGameConsole className="text-accent text-shadow-lg size-12" />
                <p className="text-accent text-shadow-lg">No consoles found for &ldquo;{query}&rdquo;.</p>
            </div>
        ),
    (_, next) => next.isPending,
);
FilteredConsoleList.displayName = "FilteredConsoleList";

const viewOptions: SegmentOption<VideogamesView>[] = [
    { label: "By Console", value: "consoles" },
    { label: "All Games", value: "games" },
];

type VideogamesViewSwitcherProps = {
    consolesWithGameCount: ConsoleWithGameCount[];
    games: Content<GameMetadata>[];
};

export const VideogamesViewSwitcher: React.FC<VideogamesViewSwitcherProps> = ({ consolesWithGameCount, games }) => {
    const { state, effects } = useVideogamesViewSwitcherStore(games, consolesWithGameCount);
    const { activeView, query, filteredGames, filteredConsoles, isPending } = state;
    const { handleFilter, handleViewChange } = effects;

    if (!activeView) {
        return null;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-center">
                <SegmentedControl options={viewOptions} value={activeView} onChange={handleViewChange} />
            </div>
            <GamesFilter
                query={query}
                onChange={handleFilter}
                placeholder={activeView === "consoles" ? "Search console..." : "Search game..."}
            />
            <div className="transition-opacity duration-150">
                {activeView === "consoles" ? (
                    <FilteredConsoleList
                        consolesWithGameCount={filteredConsoles}
                        query={query}
                        isPending={isPending}
                    />
                ) : (
                    <FilteredGameGrid games={filteredGames} query={query} isPending={isPending} />
                )}
            </div>
        </div>
    );
};
