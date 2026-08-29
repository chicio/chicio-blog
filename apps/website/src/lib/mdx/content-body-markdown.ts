import { Content } from "@/types/content/content";
import { mdxToMarkdown } from "./mdx-to-markdown";

/**
 * Content whose page has no separate title element renders its own `# Title` as the first heading of
 * its MDX body — every DSA topic and exercise does, and so do pages like mcp and cookie-policy.
 * `markdownDocument` already renders that same title as the canonical header, so the body's copy would
 * appear a second line below the first. This drops that one redundant leading heading; a body that does
 * not open with it (a blog post's italic abstract, about-me's `## Biography`) is left untouched.
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
 * An item's MDX body as markdown, without repeating the title its document header already shows. Every
 * content-backed generator converts through here, so the no-duplicate-title guarantee holds for all of
 * them rather than only the ones that remember to ask for it.
 */
export const contentBodyMarkdown = (content: Content): string =>
    stripLeadingTitleHeading(mdxToMarkdown(content.content), content.frontmatter.title);
