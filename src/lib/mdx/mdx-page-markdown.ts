import { getSingleContentBy } from "@/lib/content/content";
import { markdownDocument } from "@/lib/mdx/markdown-document";
import { mdxToMarkdown } from "@/lib/mdx/mdx-to-markdown";

/**
 * Some pages (e.g. mcp, cookie-policy) render their own `# Title` as the first heading of their
 * MDX body, for the real page's own accessible H1 (ReadingContentPage/ContentPage never render a
 * title on their own). `markdownDocument` already renders that same title as the canonical
 * header, so if the body leads with an identical `# {title}` heading it would appear twice in the
 * generated document. This strips that single redundant leading heading; a body that doesn't open
 * with it (e.g. about-me, which starts with `## Biography`) is left untouched.
 */
const stripLeadingTitleHeading = (markdown: string, title: string): string => {
    const heading = `# ${title}`;

    if (markdown === heading) {
        return "";
    }

    if (markdown.startsWith(`${heading}\n`)) {
        return markdown.slice(heading.length).replace(/^\n+/, "");
    }

    return markdown;
};

/**
 * Generic `/markdown` generator for any page backed by a standard `src/content/<slug>/content.mdx`
 * file (standard frontmatter: title, description, ...). `getSingleContentBy` is already fully
 * generic over the slug, so any such page collapses to this one-liner instead of a bespoke
 * generator file.
 */
export const mdxPageMarkdown = (slug: string): string | null => {
    const content = getSingleContentBy(slug);

    if (!content) {
        return null;
    }

    const { title, description } = content.frontmatter;

    return markdownDocument({
        title,
        description,
        slug,
        body: stripLeadingTitleHeading(mdxToMarkdown(content.content), title),
    });
};
