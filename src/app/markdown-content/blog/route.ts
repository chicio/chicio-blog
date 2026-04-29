import { getPosts, getTags } from "@/lib/content/posts";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const dynamic = "force-static";

function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

export async function GET() {
    const posts = getPosts();
    const tags = getTags();

    const content = `# Blog — ${siteMetadata.title}

> ${siteMetadata.description}

Technical blog by Fabrizio Duroni covering mobile development, web development, computer graphics, and software engineering.

## All Posts

${posts
    .map(
        (post) =>
            `- [${post.frontmatter.title}](${siteMetadata.siteUrl}${post.slug.formatted}) (${post.frontmatter.date.formatted}) — ${post.frontmatter.description}`
    )
    .join("\n")}

## Tags

${tags
    .map((tag) => `- [${tag.tagValue}](${siteMetadata.siteUrl}${slugs.blog.tag}/${tag.tagSlugText}): ${tag.count} ${tag.count === 1 ? "post" : "posts"}`)
    .join("\n")}
`;

    return new Response(content, {
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "x-markdown-tokens": String(estimateTokens(content)),
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
