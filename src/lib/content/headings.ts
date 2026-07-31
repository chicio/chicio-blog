import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkMdx from "remark-mdx";
import { toString as mdastToString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import calculateReadingTime from "reading-time";
import type { Heading, Root, RootContent } from "mdast";
import type { ContentHeading, HeadingLevel } from "@/types/content/heading";

type AnyNode = Root | RootContent;
type ParentNode = Extract<AnyNode, { children: unknown[] }>;

const hasChildren = (node: AnyNode): node is ParentNode =>
    "children" in node && Array.isArray((node as ParentNode).children);

/**
 * Every heading node in the tree, in document order. A `code` node has no `children` (its text lives
 * in `value`), so this walk never looks inside a fenced code block — a heading-like line there stays a
 * line of code, never a heading, because the AST never represents it as one.
 */
const collectHeadings = (node: AnyNode, headings: Heading[]): void => {
    if (node.type === "heading") {
        headings.push(node);
        return;
    }
    if (hasChildren(node)) {
        for (const child of node.children as AnyNode[]) {
            collectHeadings(child, headings);
        }
    }
};

const isTableOfContentsLevel = (depth: number): depth is HeadingLevel => depth === 2 || depth === 3;

// remark-math must be registered before remark-mdx — see mdx-to-markdown.ts for why. This processor is
// close to, but not identical to, that one and to the real MDX pipeline in next.config.ts, which also
// registers remark-gfm and remark-emoji. Those two are omitted here on purpose: neither changes heading
// text or heading structure (GFM autolinks/tables/strikethrough and emoji shortcodes only rewrite inline
// content within a node, they don't add or remove `heading` nodes), so they cannot change which lines
// become headings, their order, or the text handed to the slugger — verified against the current content
// set, where no heading contains a `:emoji:` shortcode or GFM-only syntax. If that ever stops being true,
// this processor needs the same two plugins added.
const processor = unified().use(remarkParse).use(remarkMath).use(remarkMdx);

/**
 * Every h2/h3 heading in a piece of MDX content, extracted from the AST rather than from raw lines —
 * a heading-like line inside a fenced code block is a `code` node, not a `heading` node, and this walk
 * never mistakes one for the other.
 *
 * IDs come from `github-slugger`, fed **every** heading in the document (including h1, even though h1
 * never makes it into the returned list) in document order through a single instance. That mirrors
 * exactly how `rehype-slug` slugs the rendered page: it slugs every heading it encounters, in order,
 * with one stateful slugger, so a duplicate heading's `-1`/`-2` suffix lands on the same entry here as
 * it does there.
 *
 * The slugger is fed the **un-trimmed** flattened text, on purpose: `rehype-slug` slugs
 * `hast-util-to-string(node)` verbatim, with no trimming. A heading written as
 * `## <SomeComponent> Hardware specs</SomeComponent>` flattens to a leading-space string, and
 * `rehype-slug` slugs that leading space right into the id (`-hardware-specs`). Trimming before slugging
 * would silently diverge from the id the rendered page actually gets — verified against real content at
 * `src/content/videogames/console/nintendo-switch/content.mdx`. Trimming is applied only to the
 * `text` field used for display, never to what feeds the slugger.
 *
 * `readingTime` for an entry covers only the words between that heading and the next one in the
 * document (any level), so it reflects the reading time of that one section rather than the whole page.
 *
 * Two further, currently-harmless divergences between this extraction and the real rendered pipeline,
 * documented rather than mirrored because no heading in the current content set triggers either one:
 * `mdast-util-to-string` includes an image's `alt` text in its flattened output, while `hast-util-to-string`
 * (what `rehype-slug` uses) yields nothing for an `<img>` — a heading containing only/mostly an image would
 * get a non-empty id here but an empty one on the rendered page. And `rehype-slug` skips slugging (and does
 * NOT consume a dedupe slot for) a heading that already carries an explicit `id` attribute; this extraction
 * has no such concept and always slugs every heading, so a heading with a hand-authored `id` would consume
 * a slot here that the real page never spent.
 */
export const extractHeadings = (markdown: string): ContentHeading[] => {
    const tree = processor.parse(markdown) as Root;
    const allHeadings: Heading[] = [];
    collectHeadings(tree, allHeadings);

    const slugger = new GithubSlugger();
    const entries: ContentHeading[] = [];

    allHeadings.forEach((heading, index) => {
        const rawText = mdastToString(heading);
        const id = slugger.slug(rawText);

        if (!isTableOfContentsLevel(heading.depth)) {
            return;
        }

        const sectionStart = heading.position?.end.offset ?? 0;
        const sectionEnd = allHeadings[index + 1]?.position?.start.offset ?? markdown.length;
        const sectionText = markdown.slice(sectionStart, sectionEnd);

        entries.push({
            level: heading.depth,
            id,
            text: rawText.trim(),
            readingTime: calculateReadingTime(sectionText),
        });
    });

    return entries;
};
