import { siteMetadata } from "@/types/configuration/site-metadata";

export interface MarkdownDocumentParams {
    title: string;
    description: string;
    slug: string;
    body: string;
}

/**
 * The canonical `/markdown` document header shared by every generator: title, description
 * blockquote, canonical URL, a `---` separator, then the page-specific body. Any generator
 * whose page has extra metadata (author, tags, difficulty, ...) folds it into `body`, ahead
 * of the actual content, rather than growing this header shape per page.
 */
export const markdownDocument = ({ title, description, slug, body }: MarkdownDocumentParams): string => `# ${title}

> ${description}

**URL:** ${siteMetadata.siteUrl}${slug}

---

${body}
`;
