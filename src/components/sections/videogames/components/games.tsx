import { FC } from "react";
import { GameGrid } from "./games-grid";
import { getAllGamesForConsole } from "@/lib/content/videogames";
import { ConsoleMetadata } from "@/types/content/videogames";
import { Content } from "@/types/content/content";
import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { ConsoleHeader } from "./console-header";
import { tracking } from "@/types/configuration/tracking";
import { TerminalLink } from "@/components/design-system/molecules/links/terminal-link";
import { BluePillLink } from "@/components/design-system/molecules/links/pills-links";
import { slugs } from "@/types/configuration/slug";
import { buildSlug } from "@/lib/slug/slug-builder";
import { VideogameNavigation } from "./videogame-navigation";

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
    </ReadingContentPageTemplate>
  );
};
