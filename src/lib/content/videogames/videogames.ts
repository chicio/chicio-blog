import { Content } from "@/types/content/content";
import { slugs } from "@/types/configuration/slug";
import { ConsoleMetadata, GameMetadata } from "@/types/content/videogames";
import { createSection } from "../section";

export const consoles = createSection<ConsoleMetadata>({
  slug: slugs.videogames.console,
  sort: (console, anotherConsole) =>
    parseInt(console.frontmatter.metadata!.releaseYear) -
    parseInt(anotherConsole.frontmatter.metadata!.releaseYear),
});

export const games = createSection<GameMetadata>({
  slug: slugs.videogames.game,
  sort: (game, anotherGame) =>
    new Date(game.frontmatter.metadata!.releaseYear).getTime() -
    new Date(anotherGame.frontmatter.metadata!.releaseYear).getTime(),
});

export const getAllGamesForConsole = (
  consoleName: string,
): Content<GameMetadata>[] =>
  games.list().filter((game) => game.frontmatter.metadata?.console === consoleName);
