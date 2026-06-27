"use client";

import Image from "next/image";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";
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
    const { state, effects } = useGameCardStore();
    const { isInView } = state;
    const { setEl, handleClick } = effects;
    const onClick = handleClick(navigationOrigin);

    return (
        <div
            ref={setEl}
            className="glow-container relative h-80 w-full overflow-hidden rounded-lg shadow-lg"
            key={game.frontmatter.title}
            onClick={onClick}
        >
            {isInView && (
                <StandardInternalLinkWithTracking
                    to={game.slug.formatted}
                    className="block h-full w-full"
                >
                    <Image
                        src={game.frontmatter.image}
                        alt={game.frontmatter.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="h-full w-full object-cover blur-lg"
                        priority={true}
                    />
                    <Image
                        src={game.frontmatter.image}
                        alt={game.frontmatter.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="h-full w-full object-contain"
                        priority={true}
                    />
                    <div className="absolute bottom-0 left-0 flex w-full items-center justify-center p-2">
                        <GlassmorphismBackground className="bg-black-alpha-75 w-full p-1!">
                            <p className="my-1 px-2 text-center text-white">{game.frontmatter.title}</p>
                        </GlassmorphismBackground>
                    </div>
                    <div className="absolute top-1 right-1 z-20 flex flex-row gap-1 items-center">
                        {game.frontmatter.metadata?.formats.map((format) => (
                            <span
                                key={format}
                                className="glow-border bg-general-background-light px-2 py-2 text-primary font-mono text-base text-shadow-sm"
                            >
                                <GameFormatIcon format={format} />
                            </span>
                        ))}
                    </div>
                </StandardInternalLinkWithTracking>
            )}
        </div>
    );
};
