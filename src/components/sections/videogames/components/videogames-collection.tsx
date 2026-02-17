import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import {
  getAllConsoles,
  getAllGames,
  getAllGamesForConsole,
} from "@/lib/content/videogames";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { VideogameCollectionDataCard } from "./videogame-collection-data-card";
import { ConsoleCard } from "@/components/sections/videogames/components/console-card";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { ContentPageTemplate } from "@/components/design-system/templates/content-page-template";

export const VideogamesCollection: React.FC = () => {
  const consoles = getAllConsoles();
  const games = getAllGames();

  return (
    <ContentPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.videogames}
    >
      <PageTitle>My Videogames Collection</PageTitle>
      <p>
        A journey through Videogames history that I started in 1992. From 8-bit
        consoles to modern powerhouses, each one tells a story of technological
        evolution and countless hours of gameplay. A place where my mind can
        breathe.
      </p>
      <div className="mt-10 mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <VideogameCollectionDataCard
          quantity={consoles.length}
          label="Consoles"
        ></VideogameCollectionDataCard>
        <VideogameCollectionDataCard
          quantity={games.length}
          label="Games"
        ></VideogameCollectionDataCard>
        <VideogameCollectionDataCard
          quantity={7}
          label="Generations"
        ></VideogameCollectionDataCard>
        <VideogameCollectionDataCard
          quantity={new Date().getFullYear() - 1992}
          label="Years"
        ></VideogameCollectionDataCard>
      </div>
      <div className="flex flex-col gap-6">
        {consoles.map((console) => (
          <ConsoleCard
            console={console}
            gamesCount={
              getAllGamesForConsole(console.frontmatter.metadata?.name || "")
                .length
            }
            key={console.frontmatter.metadata?.name}
          />
        ))}
      </div>
      <JsonLd
        type="Website"
        url={siteMetadata.siteUrl}
        imageUrl={siteMetadata.featuredImage}
        title={siteMetadata.title}
      />
    </ContentPageTemplate>
  );
};
