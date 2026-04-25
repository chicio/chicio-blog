import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { createSearchIndex } from "@/lib/content/search-index-factory";
import { getIndexableContent } from "@/lib/content/indexable-content";

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
                const index = createSearchIndex(getIndexableContent());

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
