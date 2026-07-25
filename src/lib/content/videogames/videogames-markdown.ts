import {
    consoles,
    games,
    getAllGamesForConsole,
} from "@/lib/content/videogames/videogames";
import { markdownDocument } from "@/lib/mdx/markdown-document";
import { mdxToMarkdown } from "@/lib/mdx/mdx-to-markdown";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const videogamesMarkdown = (): string => {
    const allConsoles = consoles.list();
    const allGames = games.list();

    const body = `## Consoles (${allConsoles.length})

${allConsoles.map((c) => `- [${c.frontmatter.title}](${siteMetadata.siteUrl}${c.slug.formatted}) (${c.frontmatter.metadata?.releaseYear ?? "unknown"}) — ${c.frontmatter.description}`).join("\n")}

## Games (${allGames.length})

${allGames.map((g) => `- [${g.frontmatter.title}](${siteMetadata.siteUrl}${g.slug.formatted}) (${g.frontmatter.metadata?.console ?? "unknown"}, ${g.frontmatter.metadata?.releaseYear ?? "unknown"}) — ${g.frontmatter.description}`).join("\n")}
`;

    return markdownDocument({
        title: `Videogame Collection — ${siteMetadata.title}`,
        description: "Personal videogame collection by Fabrizio Duroni.",
        slug: slugs.videogames.home,
        body,
    });
};

export const consoleMarkdown = (params: Record<string, string>): string | null => {
    const consoleData = consoles.single(params);

    if (!consoleData) {
        return null;
    }

    const { frontmatter, content, slug } = consoleData;
    const consoleGames = getAllGamesForConsole(frontmatter.metadata!.name);

    const body = `**Manufacturer:** ${frontmatter.metadata?.manufacturer ?? "unknown"}
**Release Year:** ${frontmatter.metadata?.releaseYear ?? "unknown"}
**Generation:** ${frontmatter.metadata?.generation ?? "unknown"}

${mdxToMarkdown(content)}
${consoleGames.length > 0 ? `
## Games (${consoleGames.length})

${consoleGames.map((g) => `- [${g.frontmatter.title}](${siteMetadata.siteUrl}${g.slug.formatted}) (${g.frontmatter.metadata?.releaseYear ?? "unknown"}) — ${g.frontmatter.description}`).join("\n")}
` : ""}`;

    return markdownDocument({
        title: frontmatter.title,
        description: frontmatter.description,
        slug: slug.formatted,
        body,
    });
};

export const gameMarkdown = (params: Record<string, string>): string | null => {
    const game = games.single(params);

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
