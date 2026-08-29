import { createSection } from "@/lib/content/section";
import { contentBodyMarkdown } from "./content-body-markdown";
import { contentItemMarkdown } from "./content-item-markdown";

/**
 * The `/markdown` generator for any page backed by a standard `src/content/<slug>/content.mdx`.
 *
 * A single page is just a collection item whose slug has no dynamic segments, so this is
 * `contentItemMarkdown` over a one-item section rather than a second implementation of the same
 * document skeleton.
 */
export const mdxPageMarkdown = (slug: string): string | null =>
    contentItemMarkdown(createSection({ slug }), contentBodyMarkdown)({});
