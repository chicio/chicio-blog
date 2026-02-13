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

interface GamesGridProps {
  games: Content<GameMetadata>[];
}

export const GameGrid: FC<GamesGridProps> = ({ games }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    {games.length > 0 &&
      games.map((game) => (
        <div
          className="glow-container flex h-full w-full flex-col overflow-hidden"
          key={game.slug.formatted}
        >
          <StandardInternalLinkWithTracking
            to={game.slug.formatted}
            key={game.slug.formatted}
            className="flex h-full no-underline hover:no-underline"
            trackingData={{
              category: tracking.category.videogames,
              label: tracking.label.body,
              action: tracking.action.open_videogame_game,
            }}
          >
            <Image
              src={game.frontmatter.image}
              alt={game.frontmatter.title}
              width={500}
              height={500}
              className="object-cover"
            />
          </StandardInternalLinkWithTracking>
          <div className="flex w-full flex-1 flex-col p-5">
            <StandardInternalLinkWithTracking
              to={game.slug.formatted}
              key={game.slug.formatted}
              className="flex flex-col h-full no-underline hover:no-underline"
              trackingData={{
                category: tracking.category.videogames,
                label: tracking.label.body,
                action: tracking.action.open_videogame_game,
              }}
            >
              <h5>{game.frontmatter.title}</h5>
              <span className="text-primary-text">
                {game.frontmatter.metadata!.developer}
              </span>
              <div className={`my-4 flex flex-col gap-2 md:flex-row`}>
                <InfoPill
                  icon={<BiCalendar />}
                  label="Released"
                  value={game.frontmatter.metadata!.releaseYear}
                />
                <InfoPill
                  icon={<TbDeviceGamepad2 />}
                  label="Genre"
                  value={game.frontmatter.metadata!.genre}
                />
              </div>
              <p>{game.frontmatter.description}</p>
            </StandardInternalLinkWithTracking>
            <div className="mt-auto">
              <TerminalLink
                to={game.slug.formatted}
                trackingData={{
                  category: tracking.category.videogames,
                  label: tracking.label.body,
                  action: tracking.action.open_videogame_game,
                }}
                label="See more"
              />
            </div>
          </div>
        </div>
      ))}
  </div>
);
