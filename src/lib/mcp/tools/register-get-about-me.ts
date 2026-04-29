import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAboutMe } from "@/lib/content/about-me/about-me";
import { MCP_SITE_URL } from "@/lib/mcp/config";

export const registerGetAboutMe = (server: McpServer): void => {
    server.registerTool(
        "get_about_me",
        {
            title: "Get About Me",
            description:
                "Returns Fabrizio Duroni's full about me page content, including professional background, skills, and interests.",
        },
        async () => {
            const aboutMe = getAboutMe();

            const result = {
                title: aboutMe.frontmatter.title,
                description: aboutMe.frontmatter.description,
                content: aboutMe.content,
                url: "${MCP_SITE_URL}/about-me",
            };

            return {
                content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
            };
        },
    );
};
