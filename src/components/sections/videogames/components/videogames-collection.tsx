import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import {
  getAllConsoles,
  getAllGames,
  getAllGamesForConsole,
} from "@/lib/content/videogames";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { VideogameCollectionDataCard } from "./videogame-collection-data-card";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { ContentPageTemplate } from "@/components/design-system/templates/content-page-template";
import { VideogamesViewSwitcher } from "@/components/sections/videogames/components/videogames-view-switcher";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";

export const VideogamesCollection: React.FC = () => {
  const consoles = getAllConsoles();
  const gamesSortedByReleaseYear = getAllGames();
  const consolesWithGameCount = consoles.map((console) => ({
    console,
    gamesCount: getAllGamesForConsole(console.frontmatter.metadata?.name ?? "")
      .length,
  }));

  return (
    <ContentPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.videogames}
    >
      <PageTitle>My Videogames Collection</PageTitle>
      <p>
        My journey through Videogames that I started in 1992. From 8-bit
        consoles to modern powerhouses, each one tells a story of technological
        evolution and countless hours of gameplay. Videogames are{" "}
        <StandardInternalLinkWithTracking
          to="/about-me"
          trackingData={{
            category: tracking.category.videogames,
            action: tracking.action.open_about_me,
            label: tracking.label.body,
          }}
        >
          one of the reason why I became a software engineer
        </StandardInternalLinkWithTracking>
        .
      </p>
      <div className="mt-10 mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <VideogameCollectionDataCard
          quantity={consoles.length}
          label="Consoles"
        ></VideogameCollectionDataCard>
        <VideogameCollectionDataCard
          quantity={gamesSortedByReleaseYear.length}
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
      <VideogamesViewSwitcher
        consolesWithGameCount={consolesWithGameCount}
        games={gamesSortedByReleaseYear}
      />
      <JsonLd
        type="Website"
        url={siteMetadata.siteUrl}
        imageUrl={siteMetadata.featuredImage}
        title={siteMetadata.title}
      />
    </ContentPageTemplate>
  );
};
