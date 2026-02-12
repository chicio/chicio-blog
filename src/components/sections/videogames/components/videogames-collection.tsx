import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import {
  getAllConsoles,
  getAllGames,
  getAllGamesForConsole,
} from "@/lib/content/videogames";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { VideogameCollectionDataCard } from "./videogame-collection-data-card";
import { ConsoleCard } from "@/components/sections/videogames/components/console-card";

const getGeneration = (releaseYear: string): string => {
  const year = parseInt(releaseYear);
  if (year >= 1972 && year <= 1977) return "1st";
  if (year >= 1976 && year <= 1992) return "2nd";
  if (year >= 1983 && year <= 2003) return "3rd";
  if (year >= 1987 && year <= 2004) return "4th";
  if (year >= 1993 && year <= 2005) return "5th";
  if (year >= 1998 && year <= 2013) return "6th";
  if (year >= 2005 && year <= 2017) return "7th";
  if (year >= 2012 && year <= 2020) return "8th";
  if (year >= 2020) return "9th";
  return "Unknown";
};

export const VideogamesCollection: React.FC = () => {
  const consoles = getAllConsoles();
  const games = getAllGames();

  return (
    <ReadingContentPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.videogames}
    >
      <PageTitle>My Videogames Collection</PageTitle>
      <p>
        A journey through gaming history that started in 1992. From 8-bit
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
        {consoles.map((console) => {
          const gamesForConsole = getAllGamesForConsole(
            console.frontmatter.metadata?.name || "",
          );
          const acquiredYear = parseInt(
            console.frontmatter.date.formatted.split("-")[0],
          );

          return (
            <ConsoleCard
              key={console.frontmatter.metadata?.name}
              year={console.frontmatter.metadata?.releaseYear || ""}
              id={console.frontmatter.metadata?.sku || ""}
              gamesCount={gamesForConsole.length}
              brand={console.frontmatter.metadata?.manufacturer || ""}
              name={console.frontmatter.metadata?.name || ""}
              released={console.frontmatter.metadata?.releaseYear || ""}
              acquired={console.frontmatter.date.formatted.split("-")[0]}
              generation={getGeneration(
                console.frontmatter.metadata?.releaseYear || "",
              )}
              description={console.frontmatter.description}
              imageSrc={console.frontmatter.image}
              imageAlt={console.frontmatter.title}
              href={console.slug.formatted}
            />
          );
        })}
      </div>
    </ReadingContentPageTemplate>
  );
};
