import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllConsoles } from "@/lib/content/videogames/videogames";
import { MCP_SITE_URL } from "@/lib/mcp/config";

export const registerGetVideogameConsoles = (server: McpServer): void => {
    server.registerTool(
        "get_videogame_consoles",
        {
            title: "Get Videogame Consoles",
            description:
                "Returns all video game consoles in Fabrizio's collection, sorted by release year. " +
                "Use the console name field as the filter value in get_videogame_games.",
        },
        async () => {
            const consoles = getAllConsoles();

            const result = consoles.map((c) => ({
                name: c.frontmatter.metadata!.name,
                manufacturer: c.frontmatter.metadata!.manufacturer,
                releaseYear: c.frontmatter.metadata!.releaseYear,
                acquiredYear: c.frontmatter.metadata!.acquiredYear,
                bits: c.frontmatter.metadata!.bits,
                generation: c.frontmatter.metadata!.generation,
                url: `${MCP_SITE_URL}${c.slug.formatted}`,
            }));

            return {
                content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
            };
        },
    );
};
