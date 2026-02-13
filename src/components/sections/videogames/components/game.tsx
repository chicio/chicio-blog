import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC, PropsWithChildren } from "react";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { Content } from "@/types/content/content";
import { GameMetadata } from "@/types/content/videogames";
import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { GameInformation } from "./game-information";
import { TerminalLink } from "@/components/design-system/molecules/links/terminal-link";
import { slugs } from "@/types/configuration/slug";
import { buildSlug } from "@/lib/slug/slug-builder";

interface GameProps {
  game: Content<GameMetadata>;
  console: string;
}

export const Game: FC<PropsWithChildren<GameProps>> = async ({
  game,
  console,
}) => {
  const { contentFileRelativePath: contentPath } = game;
  const { default: GameContent } = await import(
    `@/content/${contentPath}/content.mdx`
  );

  return (
    <ReadingContentPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.videogames}
    >
      <PageTitle>{game.frontmatter.title}</PageTitle>
      <ImageGlow
        src={game.frontmatter.image}
        alt={game.frontmatter.title}
        width={800}
        height={450}
        className="mb-6 h-full max-h-96 w-full object-cover"
      />
      <GameInformation 
        releaseYear={game.frontmatter.metadata?.releaseYear}
        acquiredYear={game.frontmatter.metadata?.acquiredYear}
        developer={game.frontmatter.metadata?.developer}
        publisher={game.frontmatter.metadata?.publisher}
        genre={game.frontmatter.metadata?.genre}
        pegiRating={game.frontmatter.metadata?.pegiRating}
        region={game.frontmatter.metadata?.region}
        console={console}
        className="mb-6"
      />
      <GameContent />
      <div className="mt-8 flex flex-row justify-center">
        <TerminalLink
          to={buildSlug(slugs.videogames.console, { console })}
          label={`Back to ${game.frontmatter.metadata?.console}`}
          trackingData={{
            category: tracking.category.videogames,
            label: tracking.label.body,
            action: tracking.action.open_videogame_game,
          }}
        />
      </div>
      <JsonLd
        type="BlogPosting"
        url={`${siteMetadata.siteUrl}${game.slug.formatted}`}
        imageUrl={siteMetadata.featuredImage}
        title={game.frontmatter.title}
        description={siteMetadata.description}
        keywords={game.frontmatter.tags}
      />
    </ReadingContentPageTemplate>
  );
};
