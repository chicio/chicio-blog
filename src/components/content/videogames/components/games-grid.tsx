import { Content } from "@/types/content/content";
import { GameMetadata, VideogamesNavigationOrigin } from "@/types/content/videogames";
import { FC } from "react";
import { GameCard } from "./game-card";

interface GamesGridProps {
    games: Content<GameMetadata>[];
    navigationOrigin?: VideogamesNavigationOrigin;
}

export const GameGrid: FC<GamesGridProps> = ({ games, navigationOrigin }) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {games.length > 0 &&
            games.map((game) => <GameCard key={game.slug.formatted} game={game} navigationOrigin={navigationOrigin} />)}
    </div>
);
