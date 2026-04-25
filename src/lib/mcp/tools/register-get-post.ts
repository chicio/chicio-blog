import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { getPostBy } from "@/lib/content/posts";

export const registerGetPost = (server: McpServer): void => {
    server.registerTool(
        "get_post",
        {
            title: "Get Blog Post",
            description:
                "Retrieve the full content and metadata of a specific blog post. " +
                "Use the year, month, day, and slug values returned by list_posts.",
            inputSchema: {
                year: z.string().describe("Publication year (e.g. '2024')"),
                month: z.string().describe("Publication month, zero-padded (e.g. '01')"),
                day: z.string().describe("Publication day, zero-padded (e.g. '04')"),
                slug: z.string().describe("Post slug (e.g. 'advent-of-typescript-2023-tic-tac-toe')"),
            },
        },
        async ({ year, month, day, slug }) => {
            const post = getPostBy({ year, month, day, slug });

            if (!post) {
                return {
                    content: [
                        {
                            type: "text" as const,
                            text: `Post not found: ${year}/${month}/${day}/${slug}`,
                        },
                    ],
                    isError: true,
                };
            }

            const result = {
                title: post.frontmatter.title,
                description: post.frontmatter.description,
                tags: post.frontmatter.tags,
                authors: post.frontmatter.authors.map((a) => a.name),
                date: post.frontmatter.date.formatted,
                readingTime: post.readingTime.text,
                url: `https://chicio.dev${post.slug.formatted}`,
                content: post.content,
            };

            return {
                content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
            };
        },
    );
};
