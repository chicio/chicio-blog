import { posts, getTags } from "@/lib/content/posts/posts";
import { markdownDocument } from "@/lib/mdx/markdown-document";
import { mdxToMarkdown } from "@/lib/mdx/mdx-to-markdown";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const homepageMarkdown = (): string => {
    const latestPosts = posts.list().slice(0, 10);

    const body = `Personal blog and portfolio by Fabrizio Duroni, a Software Engineer passionate about computer graphics, mobile development, and software engineering best practices.

## Navigation

- [Blog](${siteMetadata.siteUrl}${slugs.blog.home}) — Technical articles and tutorials
- [Blog Archive](${siteMetadata.siteUrl}${slugs.blog.blogArchive}) — Complete chronological archive
- [Blog Tags](${siteMetadata.siteUrl}${slugs.blog.tags}) — Browse all topic tags
- [Chat](${siteMetadata.siteUrl}${slugs.chat}) — AI-powered chat interface
- [About Me](${siteMetadata.siteUrl}${slugs.aboutMe}) — Author bio and professional background
- [MCP Server](${siteMetadata.siteUrl}${slugs.mcp}) — Model Context Protocol server

## Latest Posts

${latestPosts.map((post) => `- [${post.frontmatter.title}](${siteMetadata.siteUrl}${post.slug.formatted}) — ${post.frontmatter.description}`).join("\n")}

## About

Fabrizio Duroni is a Software Engineer at lastminute.com. He writes about mobile development, web development, computer graphics, and software engineering best practices.
`;

    return markdownDocument({ title: siteMetadata.title, description: siteMetadata.description, slug: "/", body });
};

export const blogListingMarkdown = (): string => {
    const allPosts = posts.list();
    const tags = getTags();

    const body = `Technical blog by Fabrizio Duroni covering mobile development, web development, computer graphics, and software engineering.

## All Posts

${allPosts.map((post) => `- [${post.frontmatter.title}](${siteMetadata.siteUrl}${post.slug.formatted}) (${post.frontmatter.date.formatted}) — ${post.frontmatter.description}`).join("\n")}

## Tags

${tags.map((tag) => `- [${tag.tagValue}](${siteMetadata.siteUrl}${slugs.blog.tag}/${tag.tagSlugText}): ${tag.count} ${tag.count === 1 ? "post" : "posts"}`).join("\n")}
`;

    return markdownDocument({
        title: `Blog — ${siteMetadata.title}`,
        description: siteMetadata.description,
        slug: slugs.blog.home,
        body,
    });
};

export const blogPostMarkdown = (params: Record<string, string>): string | null => {
    const post = posts.single(params);

    if (!post) {
        return null;
    }

    const { frontmatter, content, slug } = post;

    const body = `**Author:** ${frontmatter.authors.map((a) => a.name).join(", ")}
**Date:** ${frontmatter.date.formatted}
**Tags:** ${frontmatter.tags.join(", ")}

${mdxToMarkdown(content)}
`;

    return markdownDocument({
        title: frontmatter.title,
        description: frontmatter.description,
        slug: slug.formatted,
        body,
    });
};
