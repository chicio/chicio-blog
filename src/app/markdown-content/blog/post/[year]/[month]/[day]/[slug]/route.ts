import { getPostBy, getPosts } from "@/lib/content/posts";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { NextPostParameters } from "@/types/next/page-parameters";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

export async function generateStaticParams() {
    return getPosts().map((post) => post.slug.params);
}

export async function GET(_request: Request, { params }: NextPostParameters) {
    const receivedParameters = await params;
    const post = getPostBy(receivedParameters);

    if (!post) {
        notFound();
    }

    const { frontmatter, content, slug } = post;

    const markdownContent = `# ${frontmatter.title}

> ${frontmatter.description}

**Author:** ${frontmatter.authors.map((a) => a.name).join(", ")}
**Date:** ${frontmatter.date.formatted}
**Tags:** ${frontmatter.tags.join(", ")}
**URL:** ${siteMetadata.siteUrl}${slug.formatted}

---

${content}
`;

    return new Response(markdownContent, {
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "x-markdown-tokens": String(estimateTokens(markdownContent)),
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
