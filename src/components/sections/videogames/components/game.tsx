import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC, PropsWithChildren } from "react";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { Content } from "@/types/content/content";
import { GameMetadata } from "@/types/content/videogames";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { getAllGames } from "@/lib/content/videogames";

interface GameProps {
  game: Content<GameMetadata>;
  console: string;
}

export const Game: FC<PropsWithChildren<GameProps>> = async ({
  game,
  console
}) => {
  const { contentPath } = game;
  const { default: GameContent } = await import(`@/content/${contentPath}/content.mdx`)
  
  return <ReadingContentPageTemplate
    author={siteMetadata.author}
    trackingCategory={tracking.category.videogames}
  >
    <GameContent />
    <StandardInternalLinkWithTracking to={ `/videogames/console/${console}`} trackingData={{
      category: tracking.category.videogames,
      label: tracking.label.body,
      action: tracking.action.open_videogame_console,
    }}>
      Read more
    </StandardInternalLinkWithTracking>
    <JsonLd
      type="BlogPosting"
      url={`${siteMetadata.siteUrl}${game.slug.formatted}`}
      imageUrl={siteMetadata.featuredImage}
      title={game.frontmatter.title}
      description={siteMetadata.description}
      keywords={game.frontmatter.tags}
    />
  </ReadingContentPageTemplate>
};
