import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { BreadcrumbItem } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC, PropsWithChildren } from "react";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { Content } from "@/types/content/content";
import { ConsoleMetadata, GameMetadata } from "@/types/content/videogames";
import { ImageCarousel } from "@/components/design-system/organism/image-carousel";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { GameInformation } from "./game-information";
import { VideogameNavigation } from "./videogame-navigation";
import { ConsoleLogos } from "./console-logos";
import { slugs } from "@/types/configuration/slug";
import { getAllGames, getAllGamesForConsole } from "@/lib/content/videogames";
import { GameFormatIcon } from "./game-format-icon";

interface GameProps {
  game: Content<GameMetadata>;
  console: Content<ConsoleMetadata>;
}

export const Game: FC<PropsWithChildren<GameProps>> = async ({
  game,
  console,
}) => {
  const { contentFileRelativePath: contentPath } = game;
  const games = getAllGames();
  const currentIndex = games.findIndex(
    (g) => g.slug.formatted === game.slug.formatted,
  );
  const previousGame = games[currentIndex - 1];
  const nextGame = games[currentIndex + 1];
  const { default: GameContent } = await import(
    `@/content/${contentPath}/content.mdx`
  );

  return (
    <ReadingContentPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.videogames}
      breadcrumbs={
        [
          {
            label: "Videogames",
            href: slugs.videogames.home,
            isCurrent: false,
            trackingData: {
              action: tracking.action.open_videogame_collection,
              category: tracking.category.videogames,
              label: tracking.label.body,
            },
          },
          {
            label: console.frontmatter.metadata!.name,
            href: console.slug.formatted,
            isCurrent: false,
            trackingData: {
              action: tracking.action.open_videogame_console,
              category: tracking.category.videogames,
              label: tracking.label.body,
            },
          },
          {
            label: game.frontmatter.title,
            href: game.slug.formatted,
            isCurrent: true,
          },
        ] satisfies BreadcrumbItem[]
      }
    >
      <PageTitle>{game.frontmatter.title}</PageTitle>

      <div className="flex flex-row gap-2">
        <ConsoleLogos
          manufacturer={console.frontmatter.metadata!.manufacturer}
          manufacturerLogo={console.frontmatter.metadata!.manufacturerLogo}
          logo={console.frontmatter.metadata!.logo}
          url={console.slug.formatted}
        />
        {game.frontmatter.metadata?.formats.map((format) => (
          <span className="glow-container bg-general-background h-14 text-primary px-2 py-2 font-mono text-base flex flex-col justify-center items-center text-shadow-sm">
            <GameFormatIcon format={format} />
            <span>{format}</span>
          </span>
        ))}
      </div>
      <ImageCarousel
        images={game.frontmatter.metadata?.gallery || [game.frontmatter.image]}
        alt={game.frontmatter.title}
        className="mb-6"
      />
      <GameInformation
        releaseYear={game.frontmatter.metadata?.releaseYear}
        acquiredYear={game.frontmatter.metadata?.acquiredYear}
        developer={game.frontmatter.metadata?.developer}
        publisher={game.frontmatter.metadata?.publisher}
        genre={game.frontmatter.metadata?.genre}
        pegiRating={game.frontmatter.metadata?.pegiRating}
        region={game.frontmatter.metadata?.region}
        console={game.frontmatter.metadata?.console}
        className="mb-6"
      />
      <GameContent />
      <VideogameNavigation
        previous={
          previousGame
            ? {
                url: previousGame.slug.formatted,
                action: tracking.action.open_videogame_game,
                title: previousGame.frontmatter.title,
              }
            : undefined
        }
        next={
          nextGame
            ? {
                url: nextGame.slug.formatted,
                action: tracking.action.open_videogame_game,
                title: nextGame.frontmatter.title,
              }
            : undefined
        }
      />
      <JsonLd
        type="Website"
        url={`${siteMetadata.siteUrl}${game.slug.formatted}`}
        imageUrl={game.frontmatter.image}
        title={game.frontmatter.title}
        description={game.frontmatter.description}
        keywords={game.frontmatter.tags}
      />
    </ReadingContentPageTemplate>
  );
};
