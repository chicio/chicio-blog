import { Content } from "@/types/content/content";
import { markdownDocument } from "./markdown-document";

/**
 * The `/markdown` generator for one item of a content collection, and the counterpart to
 * `mdxPageMarkdown` for single pages.
 *
 * Every item generator resolves its item, reports null when the path has no content, and renders the
 * canonical document header from the item's frontmatter. Only the body differs between sections — that
 * is where a section surfaces its own metadata — so only the body is written per section.
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
        });
    };
