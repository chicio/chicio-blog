import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import elasticlunr from "elasticlunr";
import z from "zod";
import { SearchablePostFields } from "@/types/search/search";
import { getPosts } from "@/lib/content/posts";
import { getAllDataStructuresAndAlgorithmsTopics, getAllExercises } from "@/lib/content/data-structures-and-algorithms";
import { getAboutMe } from "@/lib/content/about-me";

const buildSearchIndex = (): elasticlunr.Index<SearchablePostFields> => {
    const index = elasticlunr<SearchablePostFields>(function () {
        this.addField("title");
        this.addField("description");
        this.addField("tags");
        this.addField("authors");
        this.setRef("slug");
    });

    const allContent = [
        ...getPosts(),
        ...getAllDataStructuresAndAlgorithmsTopics(),
        ...getAllExercises(),
        getAboutMe(),
    ];

    allContent.forEach((content) => {
        index.addDoc({
            slug: content.slug.formatted,
            title: content.frontmatter.title,
            description: content.frontmatter.description,
            tags: content.frontmatter.tags,
            authors: content.frontmatter.authors.map((a) => a.name),
        });
    });

    return index;
};

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
                const index = buildSearchIndex();

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
