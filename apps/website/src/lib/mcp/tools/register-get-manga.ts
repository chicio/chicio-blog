import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { mangas } from "@/lib/content/manga/manga";
import { MCP_SITE_URL } from "@/lib/mcp/config";

export const registerGetManga = (server: McpServer): void => {
    server.registerTool(
        "get_manga",
        {
            title: "Get Manga",
            description:
                "Returns the manga in Fabrizio's collection (one entry per series, sorted by title) with all their " +
                "metadata: authors, publisher, magazine, serialization years, genres, the edition he owns and how " +
                "many Volumes he has. Optionally filter by author (story or art) and/or status.",
            inputSchema: {
                author: z
                    .string()
                    .optional()
                    .describe("Story or art author to filter by, case insensitive (e.g. 'Takeshi Obata')"),
                status: z
                    .enum(["Completed", "Ongoing"])
                    .optional()
                    .describe("Publication status of the series to filter by"),
            },
        },
        async ({ author, status }) => {
            const wantedAuthor = author?.toLowerCase();
            const filtered = mangas.list().filter((manga) => {
                const metadata = manga.frontmatter.metadata!;
                const matchesAuthor =
                    !wantedAuthor ||
                    [...metadata.storyBy, ...metadata.artBy].some((name) => name.toLowerCase() === wantedAuthor);
                const matchesStatus = !status || metadata.status === status;

                return matchesAuthor && matchesStatus;
            });

            const result = filtered.map((manga) => ({
                title: manga.frontmatter.title,
                description: manga.frontmatter.description,
                ...manga.frontmatter.metadata!,
                url: `${MCP_SITE_URL}${manga.slug.formatted}`,
            }));

            return {
                content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
            };
        },
    );
};
