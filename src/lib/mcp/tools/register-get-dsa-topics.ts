import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllDataStructuresAndAlgorithmsTopics } from "@/lib/content/data-structures-and-algorithms";

export const registerGetDsaTopics = (server: McpServer): void => {
    server.registerTool(
        "get_dsa_topics",
        {
            title: "Get DSA Topics",
            description:
                "Returns all Data Structures and Algorithms learning topics in the portfolio, sorted by date. " +
                "Each topic has exercises — use get_dsa_exercises with the topic slug to retrieve them.",
        },
        async () => {
            const topics = getAllDataStructuresAndAlgorithmsTopics();

            const result = topics.map((topic) => ({
                title: topic.frontmatter.title,
                description: topic.frontmatter.description,
                slug: topic.slug.params.topic,
                date: topic.frontmatter.date.formatted,
                url: `https://chicio.dev${topic.slug.formatted}`,
            }));

            return {
                content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
            };
        },
    );
};
