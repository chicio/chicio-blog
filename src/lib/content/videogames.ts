import { Content } from "@/types/content/content";
import { slugs } from "@/types/configuration/slug";
import { ConsoleMetadata, GameMetadata } from "@/types/content/videogames";
import { getAllContentFor, getSingleContentBy } from "./content";

const consoleMetadataAdapter = (raw: unknown): ConsoleMetadata => {
  const { releaseYear, manufacturer, manufacturerLogo, name, sku, acquiredYear, bits, generation } = raw as Record<string, string>;

  return {
    releaseYear,
    manufacturer,
    manufacturerLogo,
    name,
    sku,
    acquiredYear,
    bits,
    generation,
  };
};

const gamesMetadataAdapter = (raw: unknown): GameMetadata => {
  const { releaseYear, console, developer, publisher, genre } = raw as Record<
    string,
    string
  >;

  return {
    releaseYear,
    console,
    developer,
    publisher,
    genre,
  };
};

export const getConsole = (
  params: Record<string, string>,
): Content<ConsoleMetadata> | undefined =>
  getSingleContentBy<ConsoleMetadata>(
    slugs.videogames.console,
    params,
    consoleMetadataAdapter,
  );

export const getAllConsoles = (): Content<ConsoleMetadata>[] =>
  getAllContentFor<ConsoleMetadata>(
    slugs.videogames.console,
    consoleMetadataAdapter,
  ).sort(
    (console, anotherConsole) =>
      new Date(console.frontmatter.date.formatted).getTime() -
      new Date(anotherConsole.frontmatter.date.formatted).getTime(),
  );

export const getGame = (
  params: Record<string, string>,
): Content<GameMetadata> | undefined =>
  getSingleContentBy<GameMetadata>(
    slugs.videogames.game,
    params,
    gamesMetadataAdapter,
  );

export const getAllGames = (): Content<GameMetadata>[] =>
  getAllContentFor<GameMetadata>(
    slugs.videogames.game,
    gamesMetadataAdapter,
  ).sort(
    (game, anotherGame) =>
      new Date(game.frontmatter.date.formatted).getTime() -
      new Date(anotherGame.frontmatter.date.formatted).getTime(),
  );

export const getAllGamesForConsole = (
  consoleName: string,
): Content<GameMetadata>[] =>
  getAllContentFor<GameMetadata>(slugs.videogames.game, gamesMetadataAdapter)
    .sort(
      (game, anotherGame) =>
        new Date(game.frontmatter.date.formatted).getTime() -
        new Date(anotherGame.frontmatter.date.formatted).getTime(),
    )
    .filter((game) => game.frontmatter.metadata?.console === consoleName);