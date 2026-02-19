"use client";

import { useState } from "react";
import { Content } from "@/types/content/content";
import { ConsoleMetadata, GameMetadata } from "@/types/content/videogames";
import { ConsoleCard } from "@/components/sections/videogames/components/console-card";
import { GameGrid } from "@/components/sections/videogames/components/games-grid";
import {
  SegmentedControl,
  SegmentOption,
} from "@/components/design-system/molecules/buttons/segmented-control";

type View = "consoles" | "games";

const viewOptions: SegmentOption<View>[] = [
  { label: "By Console", value: "consoles" },
  { label: "All Games", value: "games" },
];

type ConsoleWithGameCount = {
  console: Content<ConsoleMetadata>;
  gamesCount: number;
};

type VideogamesViewSwitcherProps = {
  consolesWithGameCount: ConsoleWithGameCount[];
  games: Content<GameMetadata>[];
};

export const VideogamesViewSwitcher: React.FC<VideogamesViewSwitcherProps> = ({
  consolesWithGameCount,
  games,
}) => {
  const [activeView, setActiveView] = useState<View>("consoles");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <SegmentedControl
          options={viewOptions}
          value={activeView}
          onChange={setActiveView}
        />
      </div>
      {activeView === "consoles" ? (
        <div className="flex flex-col gap-6">
          {consolesWithGameCount.map(({ console, gamesCount }) => (
            <ConsoleCard
              console={console}
              gamesCount={gamesCount}
              key={console.frontmatter.metadata?.name}
            />
          ))}
        </div>
      ) : (
        <GameGrid games={games} />
      )}
    </div>
  );
};
