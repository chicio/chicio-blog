import { describe, it, expect } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkMdx from "remark-mdx";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import type { Element, Root as HastRoot, RootContent as HastRootContent } from "hast";
import { extractHeadings } from "./headings";

type AnyHastNode = HastRoot | HastRootContent;

interface RenderedHeading {
    tag: string;
    id: string;
}

const isHeadingElement = (node: AnyHastNode): node is Element =>
    node.type === "element" && /^h[1-6]$/.test(node.tagName);

const collectHastHeadings = (node: AnyHastNode, headings: RenderedHeading[]): void => {
    if (isHeadingElement(node)) {
        headings.push({ tag: node.tagName, id: String(node.properties.id ?? "") });
    }
    if ("children" in node) {
        for (const child of node.children as AnyHastNode[]) {
            collectHastHeadings(child, headings);
        }
    }
};

/**
 * Runs `markdown` through the actual `remark-rehype` + `rehype-slug` pipeline (the real packages the
 * rendered page uses, not a re-implementation of them) and returns the tag + `id` rehype-slug assigns to
 * every heading, in document order, at every level (h1-h6) — the same population `extractHeadings`'
 * internal slugger is fed, so filtering this down to h2/h3 gives the exact ids the rendered page puts on
 * the anchors `extractHeadings` is supposed to match.
 */
const renderedHeadings = (markdown: string): RenderedHeading[] => {
    const processor = unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkMdx)
        .use(remarkRehype, {
            passThrough: ["mdxJsxFlowElement", "mdxJsxTextElement", "mdxFlowExpression", "mdxTextExpression"],
        });
    const tree = processor.runSync(processor.parse(markdown)) as HastRoot;
    rehypeSlug()(tree);

    const headings: RenderedHeading[] = [];
    collectHastHeadings(tree, headings);
    return headings;
};

const renderedInScopeIds = (markdown: string): string[] =>
    renderedHeadings(markdown)
        .filter((heading) => heading.tag === "h2" || heading.tag === "h3")
        .map((heading) => heading.id);

describe("extractHeadings", () => {
    it("extracts h2 and h3 headings with their slug ids", () => {
        const markdown = `## First Section

Some text.

### A Sub Section

More text.

## Second Section

Even more text.
`;

        const headings = extractHeadings(markdown);

        expect(headings).toEqual([
            expect.objectContaining({ level: 2, id: "first-section", text: "First Section" }),
            expect.objectContaining({ level: 3, id: "a-sub-section", text: "A Sub Section" }),
            expect.objectContaining({ level: 2, id: "second-section", text: "Second Section" }),
        ]);
    });

    it("skips h1, since it is the page title rendered separately", () => {
        const markdown = `# Page Title

## First Section
`;

        const headings = extractHeadings(markdown);

        expect(headings).toHaveLength(1);
        expect(headings[0].text).toBe("First Section");
    });

    it("never extracts a heading-like line inside a fenced code block", () => {
        const markdown = `## Real Heading

\`\`\`markdown
## Not A Real Heading
### Also Not Real
\`\`\`

## Another Real Heading
`;

        const headings = extractHeadings(markdown);

        expect(headings.map((heading) => heading.text)).toEqual(["Real Heading", "Another Real Heading"]);
    });

    it("skips h4 and deeper, out of scope for the reading companion", () => {
        const markdown = `## Real Section

#### Too Deep

##### Even Deeper
`;

        const headings = extractHeadings(markdown);

        expect(headings).toHaveLength(1);
        expect(headings[0].text).toBe("Real Section");
    });

    it("flattens rich inline formatting down to plain heading text", () => {
        const markdown = "## Using `useState` in **React**\n";

        const headings = extractHeadings(markdown);

        expect(headings[0].text).toBe("Using useState in React");
    });

    it("dedupes repeated heading text with the same -1/-2 suffixes github-slugger applies to the rendered page", () => {
        const markdown = `## Setup

## Setup

## Setup
`;

        const headings = extractHeadings(markdown);

        expect(headings.map((heading) => heading.id)).toEqual(["setup", "setup-1", "setup-2"]);
    });

    it("consumes a dedupe slot for a same-text h4 (out of scope) before an in-scope h3, matching rehype-slug's real anchor on the rendered page", () => {
        // rehype-slug slugs every heading it renders, regardless of level, in document order — an
        // h4 "Static Arrays" (out of scope here) consumes "static-arrays" first, so the h3 later
        // in the document with the exact same text gets "static-arrays-1" on the real page. This
        // mirrors the real content at
        // src/content/data-structures-and-algorithms/topic/array/content.mdx, verified against the
        // live extraction output during implementation.
        const markdown = `## Classification

#### Static Arrays

Out of scope text.

### Static Arrays

In scope text.
`;

        const headings = extractHeadings(markdown);

        expect(headings.map((heading) => heading.id)).toEqual(["classification", "static-arrays-1"]);
    });

    it("consumes a duplicate-with-the-h1 dedupe slot even though h1 itself is never returned", () => {
        const markdown = `# Intro

## Intro
`;

        const headings = extractHeadings(markdown);

        expect(headings).toHaveLength(1);
        expect(headings[0].id).toBe("intro-1");
    });

    it("gives each heading a reading time covering only the words up to the next heading", () => {
        const markdown = `## Short

one two three

## Long

${"word ".repeat(400).trim()}
`;

        const headings = extractHeadings(markdown);

        expect(headings[0].readingTime.words).toBeLessThan(10);
        expect(headings[1].readingTime.words).toBeGreaterThan(300);
    });

    it("returns an empty list for content with no headings", () => {
        expect(extractHeadings("Just a paragraph, no headings at all.")).toEqual([]);
    });

    describe("id agreement with the leading/trailing whitespace rehype-slug never trims", () => {
        it("slugs a JSX-wrapped heading with a leading space exactly as rehype-slug does, not the trimmed text", () => {
            // Real content shape from src/content/videogames/console/nintendo-switch/content.mdx:
            // `## <ParagraphTitleWithIcon icon={...}> Hardware specs</ParagraphTitleWithIcon>` — the space
            // before "Hardware" sits inside the JSX element's own children, so it survives to the flattened
            // heading text. rehype-slug slugs that flattened text with no trim, so the real rendered id is
            // "-hardware-specs", not "hardware-specs".
            const markdown =
                "## <ParagraphTitleWithIcon icon={<FiCpu />}> Hardware specs</ParagraphTitleWithIcon>\n";

            const headings = extractHeadings(markdown);

            expect(headings[0].id).toBe("-hardware-specs");
            expect(headings[0].text).toBe("Hardware specs");
        });
    });

    describe("cross-checked against the real rehype-slug pipeline", () => {
        it.each([
            ["plain headings, no dedupe", "## First\n\n### Sub\n\n## Second\n"],
            [
                "a JSX-wrapped heading with a leading space before an in-scope sibling",
                "## <ParagraphTitleWithIcon icon={<FiCpu />}> Hardware specs</ParagraphTitleWithIcon>\n\n## Trivia\n",
            ],
            ["repeated heading text needing -1/-2 dedupe suffixes", "## Setup\n\n## Setup\n\n## Setup\n"],
            [
                "an out-of-scope h4 consuming a dedupe slot before an in-scope h3 of the same text",
                "## Classification\n\n#### Static Arrays\n\nText.\n\n### Static Arrays\n\nText.\n",
            ],
        ])("%s", (_description, markdown) => {
            expect(extractHeadings(markdown).map((heading) => heading.id)).toEqual(renderedInScopeIds(markdown));
        });
    });
});
