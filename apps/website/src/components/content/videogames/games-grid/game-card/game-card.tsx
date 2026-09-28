"use client";

import { CoverCardBadge } from "matrix-design-system";
import { CoverCard } from "@/components/features/design-system-next/cover-card";
import { GameMetadata, VideogamesNavigationOrigin } from "@/types/content/videogames";
import { Content } from "@/types/content/content";
import { FC } from "react";
import { GameFormatIcon } from "@/components/content/videogames/game-format-icon";
import { useGameCardStore } from "./use-game-card-store";

interface GameCardProps {
    game: Content<GameMetadata>;
    navigationOrigin?: VideogamesNavigationOrigin;
}

export const GameCard: FC<GameCardProps> = ({ game, navigationOrigin = "console" }) => {
    const { effects } = useGameCardStore();
    const { handleClick } = effects;

    return (
        <CoverCard
            src={game.frontmatter.image}
            title={game.frontmatter.title}
            action={{ kind: "link", href: game.slug.formatted, onClick: handleClick(navigationOrigin) }}
            badges={game.frontmatter.metadata?.formats.map((format) => (
                <CoverCardBadge key={format}>
                    <GameFormatIcon format={format} />
                </CoverCardBadge>
            ))}
        />
    );
};
