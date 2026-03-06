"use client";

import { memo, useState } from "react";
import { Content } from "@/types/content/content";
import { GameMetadata } from "@/types/content/videogames";
import { ConsoleCard } from "@/components/sections/videogames/components/console-card";
import { GameGrid } from "@/components/sections/videogames/components/games-grid";
import {
    SegmentedControl,
    SegmentOption,
} from "@/components/design-system/molecules/buttons/segmented-control";
import { GamesFilter } from "@/components/sections/videogames/components/games-filter";
import { ConsoleWithGameCount, useGamesFilter } from "@/components/sections/videogames/hooks/use-games-filter";
import { IoGameControllerOutline } from "react-icons/io5";
import { GiGameConsole } from "react-icons/gi";

type View = "consoles" | "games";

const FilteredGameGrid = memo(
    ({ games, query }: { games: Content<GameMetadata>[]; query: string; isPending: boolean }) =>
        games.length > 0 ? (
            <GameGrid games={games} />
        ) : (
            <div className="text-secondary flex flex-col items-center gap-3 py-16">
                <IoGameControllerOutline className="text-accent text-shadow-lg size-12" />
                <p className="text-accent text-shadow-lg">No games found for &ldquo;{query}&rdquo;.</p>
            </div>
        ),
    (_, next) => next.isPending,
);

const FilteredConsoleList = memo(
    ({ consolesWithGameCount, query }: { consolesWithGameCount: ConsoleWithGameCount[]; query: string; isPending: boolean }) =>
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

const viewOptions: SegmentOption<View>[] = [
    { label: "By Console", value: "consoles" },
    { label: "All Games", value: "games" },
];

type VideogamesViewSwitcherProps = {
    consolesWithGameCount: ConsoleWithGameCount[];
    games: Content<GameMetadata>[];
};

export const VideogamesViewSwitcher: React.FC<VideogamesViewSwitcherProps> = ({
    consolesWithGameCount,
    games,
}) => {
    const [activeView, setActiveView] = useState<View>("consoles");
    const { query, filteredGames, filteredConsoles, handleFilter, resetFilter, isPending } = useGamesFilter(
        games,
        consolesWithGameCount,
    );

    const handleViewChange = (view: View) => {
        resetFilter();
        setActiveView(view);
    };

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
