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

// remark-math must be registered before remark-mdx — see mdx-to-markdown.ts for why. This processor
// mirrors that one on purpose: parsing the same MDX body into the same tree shape is what lets the
// headings found here, and the order they are fed to the slugger below, match what rehype-slug slugs
// on the actually rendered page.
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
 * `readingTime` for an entry covers only the words between that heading and the next one in the
 * document (any level), so it reflects the reading time of that one section rather than the whole page.
 */
export const extractHeadings = (markdown: string): ContentHeading[] => {
    const tree = processor.parse(markdown) as Root;
    const allHeadings: Heading[] = [];
    collectHeadings(tree, allHeadings);

    const slugger = new GithubSlugger();
    const entries: ContentHeading[] = [];

    allHeadings.forEach((heading, index) => {
        const text = mdastToString(heading).trim();
        const id = slugger.slug(text);

        if (!isTableOfContentsLevel(heading.depth)) {
            return;
        }

        const sectionStart = heading.position?.end.offset ?? 0;
        const sectionEnd = allHeadings[index + 1]?.position?.start.offset ?? markdown.length;
        const sectionText = markdown.slice(sectionStart, sectionEnd);

        entries.push({
            level: heading.depth,
            id,
            text,
            readingTime: calculateReadingTime(sectionText),
        });
    });

    return entries;
};
