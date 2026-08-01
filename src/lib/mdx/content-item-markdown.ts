import { Content } from "@/types/content/content";
import { markdownDocument, MarkdownSection } from "./markdown-document";
import { isMarkdownOutlineViable } from "@/lib/content/heading-viability";
import { extractHeadings } from "@/lib/content/headings";
import { siteMetadata } from "@/types/configuration/site-metadata";

/**
 * The document's outline as citable deep links, or `undefined` when there are not enough headings to
 * be worth rendering. Headings are derived on demand from `content.content` rather than read off a
 * precomputed field on `Content` — see the doc comment on `Content` in `types/content/content.ts` for why.
 */
const sectionsFor = (content: Content<unknown>): MarkdownSection[] | undefined => {
    const headings = extractHeadings(content.content);

    if (!isMarkdownOutlineViable(headings)) {
        return undefined;
    }

    return headings.map((heading) => ({
        level: heading.level,
        text: heading.text,
        url: `${siteMetadata.siteUrl}${content.slug.formatted}#${heading.id}`,
    }));
};

/**
 * The `/markdown` generator for one item of a content collection, and the counterpart to
 * `mdxPageMarkdown` for single pages.
 *
 * Every item generator resolves its item, reports null when the path has no content, and renders the
 * canonical document header from the item's frontmatter. Only the body differs between sections — that
 * is where a section surfaces its own metadata — so only the body is written per section. `sections` is
 * the one thing every content-backed item shares regardless of section, so it is resolved here once,
 * at the single choke point every content-backed generator routes through.
 */
export const contentItemMarkdown =
    <TMeta>(
        section: { single: (params: Record<string, string>) => Content<TMeta> | undefined },
        body: (content: Content<TMeta>) => string,
    ) =>
    (params: Record<string, string>): string | null => {
        const content = section.single(params);

        if (!content) {
            return null;
        }

        return markdownDocument({
            title: content.frontmatter.title,
            description: content.frontmatter.description,
            slug: content.slug.formatted,
            body: body(content),
            sections: sectionsFor(content),
        });
    };
