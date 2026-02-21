import { Content } from "@/types/content/content";
import { slugs } from "@/types/configuration/slug";
import { ConsoleMetadata, GameMetadata } from "@/types/content/videogames";
import { getAllContentFor, getSingleContentBy } from "./content";

const consoleMetadataAdapter = (raw: unknown): ConsoleMetadata => {
  const { logo, releaseYear, manufacturer, manufacturerLogo, name, sku, acquiredYear, bits, generation, gallery } = raw as Record<
    string,     
    string | string[]
  >;

  return {
    logo: logo as string,
    releaseYear: releaseYear as string,
    manufacturer: manufacturer as string,
    manufacturerLogo: manufacturerLogo as string,
    name: name as string,
    sku: sku as string,
    acquiredYear: acquiredYear as string,
    bits: bits as string,
    generation: generation as string,
    gallery: gallery as string[]
  };
};

const gamesMetadataAdapter = (raw: unknown): GameMetadata => {
  const { releaseYear, console, developer, publisher, genre, pegiRating, region, acquiredYear, gallery } = raw as Record<
    string,
    string | string[]
  >;

  return {
    releaseYear: releaseYear as string,
    acquiredYear: acquiredYear as string,
    console: console as string,
    developer: developer as string,
    publisher: publisher as string,
    genre: genre as string,
    pegiRating: pegiRating as string,
    region: region as string,
    gallery: gallery as string[],
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
      parseInt(console.frontmatter.metadata!.releaseYear) - parseInt(anotherConsole.frontmatter.metadata!.releaseYear),
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
      new Date(game.frontmatter.metadata!.releaseYear).getTime() -
      new Date(anotherGame.frontmatter.metadata!.releaseYear).getTime(),
  );

export const getAllGamesForConsole = (
  consoleName: string,
): Content<GameMetadata>[] =>
  getAllContentFor<GameMetadata>(slugs.videogames.game, gamesMetadataAdapter)
    .filter((game) => game.frontmatter.metadata?.console === consoleName)
    .sort(
    (game, anotherGame) =>
      new Date(game.frontmatter.metadata!.releaseYear).getTime() -
      new Date(anotherGame.frontmatter.metadata!.releaseYear).getTime(),
  );