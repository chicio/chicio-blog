import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC, PropsWithChildren } from "react";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { Content } from "@/types/content/content";
import { getAllGamesForConsole } from "@/lib/content/videogames";
import { ConsoleMetadata } from "@/types/content/videogames";
import { ConsoleTimeInformation } from "./console-time-information";
import { IoGameControllerOutline } from "react-icons/io5";
import { ConsoleHeader } from "./console-header";
import { GameGrid } from "./games-grid";
import { ImageCarousel } from "@/components/design-system/organism/image-carousel";
import { slugs } from "@/types/configuration/slug";
import { VideogameNavigation } from "./videogame-navigation";

interface ConsoleProps {
  console: Content<ConsoleMetadata>;
  consoleSlug: string;
}

export const Console: FC<PropsWithChildren<ConsoleProps>> = async ({
  console,
  consoleSlug,
}) => {
  const { contentFileRelativePath: contentPath } = console;
  const { default: ConsoleContent } = await import(
    `@/content/${contentPath}/content.mdx`
  );
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
        logo={console.frontmatter.metadata!.logo}
      />
      <ImageCarousel
        images={
          console.frontmatter.metadata?.gallery || [console.frontmatter.image]
        }
        alt={console.frontmatter.title}
        className="mb-6"
      />
      <ConsoleTimeInformation
        releaseYear={console.frontmatter.metadata?.releaseYear}
        acquiredYear={console.frontmatter.metadata?.acquiredYear}
        bits={console.frontmatter.metadata?.bits}
        generation={console.frontmatter.metadata?.generation}
        className="mb-6"
      />
      <ConsoleContent />
      <h2 className="mb-4 flex items-center">
        <IoGameControllerOutline className="text-primary mr-2 inline" />
        Games
      </h2>
      <GameGrid games={games} />
      <VideogameNavigation
        previous={{
          url: slugs.videogames.collection,
          action: tracking.action.open_videogame_game,
          title: "Back to collection",
        }}
      />
      <JsonLd
        type="BlogPosting"
        url={`${siteMetadata.siteUrl}${console.slug.formatted}`}
        imageUrl={console.frontmatter.image}
        title={console.frontmatter.title}
        description={console.frontmatter.description}
        keywords={console.frontmatter.tags}
      />
    </ReadingContentPageTemplate>
  );
};
