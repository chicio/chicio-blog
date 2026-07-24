import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { posts, getTags } from "@/lib/content/posts/posts";
import { topics, exercises } from "@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms";
import { consoles, games } from "@/lib/content/videogames/videogames";
import { MCP_SITE_URL } from "@/lib/mcp/config";

export const registerGetSiteStats = (server: McpServer): void => {
    server.registerTool(
        "get_site_stats",
        {
            title: "Get Site Stats",
            description:
                "Returns aggregate statistics for the portfolio: total post count, tag count, DSA topic count, " +
                "exercise count, videogame console count, game count, and the most recent post.",
        },
        async () => {
            const allPosts = posts.list();
            const tags = getTags();
            const allTopics = topics.list();
            const allExercises = exercises.list();
            const allConsoles = consoles.list();
            const allGames = games.list();

            const latestPost = allPosts[0]
                ? {
                      title: allPosts[0].frontmatter.title,
                      date: allPosts[0].frontmatter.date.formatted,
                      url: `${MCP_SITE_URL}${allPosts[0].slug.formatted}`,
                  }
                : null;

            const result = {
                postsCount: allPosts.length,
                tagsCount: tags.length,
                dsaTopicsCount: allTopics.length,
                dsaExercisesCount: allExercises.length,
                videogameConsolesCount: allConsoles.length,
                videogameGamesCount: allGames.length,
                latestPost,
            };

            return {
                content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
            };
        },
    );
};
