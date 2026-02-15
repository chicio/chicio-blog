import { Content } from "@/types/content/content";
import { GameMetadata } from "@/types/content/videogames";
import { FC } from "react";
import Image from "next/image";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { tracking } from "@/types/configuration/tracking";
import { BiCalendar } from "react-icons/bi";
import { InfoPill } from "./info-pill";
import { TbDeviceGamepad2 } from "react-icons/tb";
import { TerminalLink } from "@/components/design-system/molecules/links/terminal-link";
import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";

interface GamesGridProps {
  games: Content<GameMetadata>[];
}

export const GameGrid: FC<GamesGridProps> = ({ games }) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {games.length > 0 &&
        games.map((game) => (
          <div
            className="glow-container relative overflow-hidden rounded-lg shadow-lg h-[320px] w-full"
            key={game.slug.formatted}
          >
            <StandardInternalLinkWithTracking
              to={game.slug.formatted}
              className="block h-full w-full"
              trackingData={{
                category: tracking.category.videogames,
                label: tracking.label.body,
                action: tracking.action.open_videogame_game,
              }}
            >
              <Image
                src={game.frontmatter.image}
                alt={game.frontmatter.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover h-full w-full"
                priority={true}
              />
              <div className="absolute bottom-0 left-0 w-full p-2 flex justify-center items-center">
                <GlassmorphismBackground className="w-full p-1! bg-black-alpha-75">
                  <p className="text-white text-center px-2 my-1">
                    {game.frontmatter.title}
                  </p>
                </GlassmorphismBackground>
              </div>
            </StandardInternalLinkWithTracking>
          </div>
        ))}
    </div>
  );