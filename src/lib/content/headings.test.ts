import { describe, it, expect } from "vitest";
import { extractHeadings } from "./headings";

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
});
