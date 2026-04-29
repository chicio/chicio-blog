import { getPosts } from "@/lib/content/posts";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const dynamic = "force-static";

function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

export async function GET() {
    const posts = getPosts().slice(0, 10);

    const content = `# ${siteMetadata.title}

> ${siteMetadata.description}

Personal blog and portfolio by Fabrizio Duroni, a Software Engineer passionate about computer graphics, mobile development, and software engineering best practices.

## Navigation

- [Blog](${siteMetadata.siteUrl}${slugs.blog.home}) — Technical articles and tutorials
- [Blog Archive](${siteMetadata.siteUrl}${slugs.blog.blogArchive}) — Complete chronological archive
- [Blog Tags](${siteMetadata.siteUrl}${slugs.blog.tags}) — Browse all topic tags
- [Chat](${siteMetadata.siteUrl}${slugs.chat}) — AI-powered chat interface
- [About Me](${siteMetadata.siteUrl}${slugs.aboutMe}) — Author bio and professional background
- [MCP Server](${siteMetadata.siteUrl}${slugs.mcp}) — Model Context Protocol server

## Latest Posts

${posts
    .map(
        (post) =>
            `- [${post.frontmatter.title}](${siteMetadata.siteUrl}${post.slug.formatted}) — ${post.frontmatter.description}`
    )
    .join("\n")}

## About

Fabrizio Duroni is a Software Engineer at lastminute.com. He writes about mobile development, web development, computer graphics, and software engineering best practices.
`;

    return new Response(content, {
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "x-markdown-tokens": String(estimateTokens(content)),
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
