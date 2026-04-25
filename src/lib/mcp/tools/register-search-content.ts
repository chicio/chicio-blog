import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import elasticlunr from "elasticlunr";
import fs from "fs";
import path from "path";
import z from "zod";
import { searchIndexFileName } from "@/lib/content/search-filename";
import { SearchablePostFields } from "@/types/search/search";

export const registerSearchContent = (server: McpServer): void => {
    server.registerTool(
        "search_content",
        {
            title: "Search Portfolio Content",
            description:
                "Keyword search across all portfolio content: blog posts, DSA topics and exercises, about me. " +
                "Returns matching items with their slug, title, description, and tags.",
            inputSchema: {
                query: z.string().describe("Search query text"),
                limit: z
                    .number()
                    .optional()
                    .describe("Maximum number of results to return (default: 10, max: 30)"),
            },
        },
        async ({ query, limit }) => {
            const safeLimit = Math.min(limit ?? 10, 30);
            try {
                const indexPath = path.join(process.cwd(), "public", searchIndexFileName);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const indexData = JSON.parse(fs.readFileSync(indexPath, "utf8")) as any;
                const index = elasticlunr.Index.load<SearchablePostFields>(indexData);

                const results = index.search(query, {
                    fields: {
                        title: { boost: 3 },
                        description: { boost: 2 },
                        tags: { boost: 1 },
                    },
                    expand: true,
                });

                const enriched = results.slice(0, safeLimit).map((result) => {
                    const doc = index.documentStore.getDoc(result.ref);
                    return {
                        slug: result.ref,
                        title: doc.title,
                        description: doc.description,
                        tags: doc.tags,
                        score: result.score,
                    };
                });

                return {
                    content: [{ type: "text" as const, text: JSON.stringify(enriched, null, 2) }],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text" as const,
                            text: `Search failed: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                    isError: true,
                };
            }
        },
    );
};
