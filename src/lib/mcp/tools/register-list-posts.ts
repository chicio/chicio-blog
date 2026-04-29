import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { getPosts, getPostsForTag } from "@/lib/content/posts/posts";
import { MCP_SITE_URL } from "@/lib/mcp/config";

export const registerListPosts = (server: McpServer): void => {
    server.registerTool(
        "list_posts",
        {
            title: "List Blog Posts",
            description:
                "List blog posts, optionally filtered by tag. Returns post summaries sorted by date (newest first). " +
                "Each result includes the year, month, day, and slug required to call get_post.",
            inputSchema: {
                tag: z.string().optional().describe("Filter posts by tag (case-sensitive, e.g. 'react', 'typescript')"),
                limit: z.number().optional().describe("Maximum number of posts to return (default: 20, max: 50)"),
            },
        },
        async ({ tag, limit }) => {
            const safeLimit = Math.min(limit ?? 20, 50);
            const posts = tag ? getPostsForTag(tag) : getPosts();

            const results = posts.slice(0, safeLimit).map((post) => ({
                title: post.frontmatter.title,
                description: post.frontmatter.description,
                tags: post.frontmatter.tags,
                date: post.frontmatter.date.formatted,
                year: post.slug.params.year,
                month: post.slug.params.month,
                day: post.slug.params.day,
                slug: post.slug.params.slug,
                readingTime: post.readingTime.text,
                url: `${MCP_SITE_URL}${post.slug.formatted}`,
            }));

            return {
                content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
            };
        },
    );
};
