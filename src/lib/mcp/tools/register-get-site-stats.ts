import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getPosts, getTags } from "@/lib/content/posts";
import { getAllDataStructuresAndAlgorithmsTopics, getAllExercises } from "@/lib/content/data-structures-and-algorithms";
import { getAllConsoles, getAllGames } from "@/lib/content/videogames";
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
            const posts = getPosts();
            const tags = getTags();
            const topics = getAllDataStructuresAndAlgorithmsTopics();
            const exercises = getAllExercises();
            const consoles = getAllConsoles();
            const games = getAllGames();

            const latestPost = posts[0]
                ? {
                      title: posts[0].frontmatter.title,
                      date: posts[0].frontmatter.date.formatted,
                      url: `${MCP_SITE_URL}${posts[0].slug.formatted}`,
                  }
                : null;

            const result = {
                postsCount: posts.length,
                tagsCount: tags.length,
                dsaTopicsCount: topics.length,
                dsaExercisesCount: exercises.length,
                videogameConsolesCount: consoles.length,
                videogameGamesCount: games.length,
                latestPost,
            };

            return {
                content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
            };
        },
    );
};
