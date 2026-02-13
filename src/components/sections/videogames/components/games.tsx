import { FC } from "react";
import { GameGrid } from "./games-grid";
import { getAllGamesForConsole } from "@/lib/content/videogames";
import { ConsoleMetadata } from "@/types/content/videogames";
import { Content } from "@/types/content/content";
import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { ConsoleHeader } from "./console-header";
import { tracking } from "@/types/configuration/tracking";
import { slugs } from "@/types/configuration/slug";
import { buildSlug } from "@/lib/slug/slug-builder";
import { VideogameNavigation } from "./videogame-navigation";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";

interface GamesProps {
  console: Content<ConsoleMetadata>;
  consoleSlug: string;
}

export const Games: FC<GamesProps> = ({ console, consoleSlug }) => {
  const games = getAllGamesForConsole(console.frontmatter.metadata!.name);

  return (
    <ReadingContentPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.videogames}
    >
      <ConsoleHeader
        name={console.frontmatter.metadata!.name}
        manufacturer={console.frontmatter.metadata!.manufacturer}
        manufacturerLogo={console.frontmatter.metadata!.manufacturerLogo}
      />
      <GameGrid games={games} />
      <VideogameNavigation
        previous={{
          url: buildSlug(slugs.videogames.console, { console: consoleSlug }),
          action: tracking.action.open_videogame_console,
          title: `Back to ${console.frontmatter.metadata!.name}`,
        }}
      />
      <JsonLd
        type="Website"
        url={`${siteMetadata.siteUrl}${console.slug.formatted}`}
        imageUrl={console.frontmatter.image}
        title={console.frontmatter.title}
        description={console.frontmatter.description}
        keywords={console.frontmatter.tags}
      />
    </ReadingContentPageTemplate>
  );
};
