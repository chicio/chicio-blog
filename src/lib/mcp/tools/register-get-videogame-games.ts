import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { getAllGames, getAllGamesForConsole } from "@/lib/content/videogames/videogames";
import { MCP_SITE_URL } from "@/lib/mcp/config";

export const registerGetVideogameGames = (server: McpServer): void => {
    server.registerTool(
        "get_videogame_games",
        {
            title: "Get Videogame Games",
            description:
                "Returns games in Fabrizio's collection, sorted by release year. " +
                "Optionally filter by console name (use the name field from get_videogame_consoles) and/or genre.",
            inputSchema: {
                console: z
                    .string()
                    .optional()
                    .describe("Console name to filter by (e.g. 'PlayStation', 'Nintendo Entertainment System')"),
                genre: z.string().optional().describe("Genre to filter by (e.g. 'Action', 'RPG')"),
            },
        },
        async ({ console: consoleName, genre }) => {
            const games = consoleName ? getAllGamesForConsole(consoleName) : getAllGames();
            const filtered = genre
                ? games.filter((g) => g.frontmatter.metadata?.genre?.toLowerCase() === genre.toLowerCase())
                : games;

            const result = filtered.map((g) => ({
                title: g.frontmatter.title,
                console: g.frontmatter.metadata!.console,
                developer: g.frontmatter.metadata!.developer,
                publisher: g.frontmatter.metadata!.publisher,
                genre: g.frontmatter.metadata!.genre,
                releaseYear: g.frontmatter.metadata!.releaseYear,
                acquiredYear: g.frontmatter.metadata!.acquiredYear,
                pegiRating: g.frontmatter.metadata!.pegiRating,
                region: g.frontmatter.metadata!.region,
                formats: g.frontmatter.metadata!.formats,
                url: `${MCP_SITE_URL}${g.slug.formatted}`,
            }));

            return {
                content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
            };
        },
    );
};
