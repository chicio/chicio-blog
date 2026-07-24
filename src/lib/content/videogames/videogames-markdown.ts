import {
    getAllConsoles,
    getAllGames,
    getAllGamesForConsole,
    getConsole,
    getGame,
} from "@/lib/content/videogames/videogames";
import { markdownDocument } from "@/lib/mdx/markdown-document";
import { mdxToMarkdown } from "@/lib/mdx/mdx-to-markdown";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const videogamesMarkdown = (): string => {
    const consoles = getAllConsoles();
    const games = getAllGames();

    const body = `## Consoles (${consoles.length})

${consoles.map((c) => `- [${c.frontmatter.title}](${siteMetadata.siteUrl}${c.slug.formatted}) (${c.frontmatter.metadata?.releaseYear ?? "unknown"}) — ${c.frontmatter.description}`).join("\n")}

## Games (${games.length})

${games.map((g) => `- [${g.frontmatter.title}](${siteMetadata.siteUrl}${g.slug.formatted}) (${g.frontmatter.metadata?.console ?? "unknown"}, ${g.frontmatter.metadata?.releaseYear ?? "unknown"}) — ${g.frontmatter.description}`).join("\n")}
`;

    return markdownDocument({
        title: `Videogame Collection — ${siteMetadata.title}`,
        description: "Personal videogame collection by Fabrizio Duroni.",
        slug: slugs.videogames.home,
        body,
    });
};

export const consoleMarkdown = (params: Record<string, string>): string | null => {
    const consoleData = getConsole(params);

    if (!consoleData) {
        return null;
    }

    const { frontmatter, content, slug } = consoleData;
    const games = getAllGamesForConsole(frontmatter.metadata!.name);

    const body = `**Manufacturer:** ${frontmatter.metadata?.manufacturer ?? "unknown"}
**Release Year:** ${frontmatter.metadata?.releaseYear ?? "unknown"}
**Generation:** ${frontmatter.metadata?.generation ?? "unknown"}

${mdxToMarkdown(content)}
${games.length > 0 ? `
## Games (${games.length})

${games.map((g) => `- [${g.frontmatter.title}](${siteMetadata.siteUrl}${g.slug.formatted}) (${g.frontmatter.metadata?.releaseYear ?? "unknown"}) — ${g.frontmatter.description}`).join("\n")}
` : ""}`;

    return markdownDocument({
        title: frontmatter.title,
        description: frontmatter.description,
        slug: slug.formatted,
        body,
    });
};

export const gameMarkdown = (params: Record<string, string>): string | null => {
    const game = getGame(params);

    if (!game) {
        return null;
    }

    const { frontmatter, content, slug } = game;

    const body = `**Console:** ${frontmatter.metadata?.console ?? "unknown"}
**Developer:** ${frontmatter.metadata?.developer ?? "unknown"}
**Publisher:** ${frontmatter.metadata?.publisher ?? "unknown"}
**Genre:** ${frontmatter.metadata?.genre ?? "unknown"}
**Release Year:** ${frontmatter.metadata?.releaseYear ?? "unknown"}
**Region:** ${frontmatter.metadata?.region ?? "unknown"}

${mdxToMarkdown(content)}
`;

    return markdownDocument({
        title: frontmatter.title,
        description: frontmatter.description,
        slug: slug.formatted,
        body,
    });
};
