import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSearchContent } from "@/lib/mcp/tools/register-search-content";
import { registerListPosts } from "@/lib/mcp/tools/register-list-posts";
import { registerGetPost } from "@/lib/mcp/tools/register-get-post";
import { registerGetTags } from "@/lib/mcp/tools/register-get-tags";
import { registerGetDsaTopics } from "@/lib/mcp/tools/register-get-dsa-topics";
import { registerGetDsaExercises } from "@/lib/mcp/tools/register-get-dsa-exercises";
import { registerGetAboutMe } from "@/lib/mcp/tools/register-get-about-me";
import { registerGetSiteStats } from "@/lib/mcp/tools/register-get-site-stats";
import { registerGetVideogameConsoles } from "@/lib/mcp/tools/register-get-videogame-consoles";
import { registerGetVideogameGames } from "@/lib/mcp/tools/register-get-videogame-games";

export const createMcpServer = (): McpServer => {
    const server = new McpServer({
        name: "chicio-portfolio",
        version: "1.0.0",
    });

    registerSearchContent(server);
    registerListPosts(server);
    registerGetPost(server);
    registerGetTags(server);
    registerGetDsaTopics(server);
    registerGetDsaExercises(server);
    registerGetAboutMe(server);
    registerGetVideogameConsoles(server);
    registerGetVideogameGames(server);
    registerGetSiteStats(server);

    return server;
};
