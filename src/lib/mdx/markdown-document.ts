import { siteMetadata } from "@/types/configuration/site-metadata";
import type { HeadingLevel } from "@/types/content/heading";

/**
 * One h2/h3 entry of a document's outline, rendered as a citable deep link. `url` is already the full
 * `siteMetadata.siteUrl + slug + #anchor` — the caller resolves it, `markdownDocument` only renders it.
 */
export interface MarkdownSection {
    level: HeadingLevel;
    text: string;
    url: string;
}

export interface MarkdownDocumentParams {
    title: string;
    description: string;
    slug: string;
    body: string;
    sections?: MarkdownSection[];
}

const tableOfContents = (sections: MarkdownSection[]): string => `## Table of Contents

${sections.map((section) => `${section.level === 3 ? "  - " : "- "}[${section.text}](${section.url})`).join("\n")}

---

`;

/**
 * The canonical `/markdown` document header shared by every generator: title, description
 * blockquote, canonical URL, a `---` separator, then the page-specific body. Any generator
 * whose page has extra metadata (author, tags, difficulty, ...) folds it into `body`, ahead
 * of the actual content, rather than growing this header shape per page.
 *
 * `sections`, when given, renders as a citable outline right after the header, ahead of the body — so
 * an agent sees the document's structure, and can jump straight to a precise section via its `#anchor`
 * deep link, before reading a word of content.
 */
export const markdownDocument = ({ title, description, slug, body, sections }: MarkdownDocumentParams): string => `# ${title}

> ${description}

**URL:** ${siteMetadata.siteUrl}${slug}

---

${sections && sections.length > 0 ? tableOfContents(sections) : ""}${body}
`;
