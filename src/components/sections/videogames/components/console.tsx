import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC, PropsWithChildren } from "react";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { Content } from "@/types/content/content";
import { getAllGamesForConsole } from "@/lib/content/videogames";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { ConsoleMetadata } from "@/types/content/videogames";

interface ConsoleProps {
  console: Content<ConsoleMetadata>;
  consoleSlug: string;
}

export const Console: FC<PropsWithChildren<ConsoleProps>> = async ({
  console,
  consoleSlug
}) => {
  const { contentFileRelativePath: contentPath } = console;
  const { default: ConsoleContent } = await import(`@/content/${contentPath}/content.mdx`)
  const games = getAllGamesForConsole(consoleSlug);
  
  return <ReadingContentPageTemplate
    author={siteMetadata.author}
    trackingCategory={tracking.category.videogames}
  >
    <ConsoleContent />
    {games.length > 0 && (games.map((game) => (
      <div key={game.slug.formatted}>
        <h2>{game.frontmatter.title}</h2>
        <p>{game.frontmatter.description}</p>
        <StandardInternalLinkWithTracking to={game.slug.formatted} trackingData={ {
          category: tracking.category.videogames,
          label: tracking.label.body,
          action: tracking.action.open_videogame_game,
        }}>
          Read more
        </StandardInternalLinkWithTracking>
      </div>
    )))}
    <JsonLd
      type="BlogPosting"
      url={`${siteMetadata.siteUrl}${console.slug.formatted}`}
      imageUrl={siteMetadata.featuredImage}
      title={console.frontmatter.title}
      description={siteMetadata.description}
      keywords={console.frontmatter.tags}
    />
  </ReadingContentPageTemplate>
};
