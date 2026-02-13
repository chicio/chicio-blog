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

interface GamesProps {
  console: Content<ConsoleMetadata>;
}

export const Games: FC<GamesProps> = ({ console }) => {
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
      <div className="mt-8 flex flex-row justify-center">
        <TerminalLink
          to={`${console.slug.formatted}`}
          label="Back to console"
          trackingData={{
            category: tracking.category.videogames,
            label: tracking.label.body,
            action: tracking.action.open_videogame_game,
          }}
        />
      </div>
    </ReadingContentPageTemplate>
  );
};
