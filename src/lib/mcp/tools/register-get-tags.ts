import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getTags } from "@/lib/content/posts/posts";

export const registerGetTags = (server: McpServer): void => {
    server.registerTool(
        "get_tags",
        {
            title: "Get All Tags",
            description:
                "Returns all blog post tags with their post counts, sorted alphabetically. " +
                "Use a tag value with list_posts to filter posts by topic.",
        },
        async () => {
            const tags = getTags();

            const result = tags.map((tag) => ({
                tag: tag.tagValue,
                count: tag.count,
            }));

            return {
                content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
            };
        },
    );
};
