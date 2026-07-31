import { describe, it, expect } from "vitest";
import { contentItemMarkdown } from "./content-item-markdown";
import { siteMetadata } from "@/types/configuration/site-metadata";
import type { Content } from "@/types/content/content";
import type { ContentHeading } from "@/types/content/heading";

const heading = (level: 2 | 3, id: string, text: string): ContentHeading => ({
    level,
    id,
    text,
    readingTime: { text: "", minutes: 0, time: 0, words: 0 },
});

const makeContent = (overrides: Partial<Content> = {}): Content => ({
    frontmatter: { title: "Title", description: "Description", tags: [], authors: [], date: { year: 2024, month: 1, day: 1, formatted: "2024-01-01" }, image: "" },
    slug: { formatted: "/some/slug", params: {} },
    readingTime: { text: "", minutes: 0, time: 0, words: 0 },
    contentFileRelativePath: "",
    content: "",
    headings: [],
    ...overrides,
});

describe("contentItemMarkdown", () => {
    it("returns null when the section has no content for the given params", () => {
        const generator = contentItemMarkdown({ single: () => undefined }, () => "");

        expect(generator({})).toBeNull();
    });

    it("renders no outline when there are fewer than 2 headings", () => {
        const content = makeContent({ headings: [heading(2, "one", "One")] });
        const generator = contentItemMarkdown({ single: () => content }, () => "Body.");

        expect(generator({})).not.toContain("## Table of Contents");
    });

    it("renders the outline as full citable deep links when there are 2 or more headings", () => {
        const content = makeContent({
            slug: { formatted: "/dsa/topic/graph", params: {} },
            headings: [heading(2, "intro", "Introduction"), heading(3, "bfs", "BFS")],
        });
        const generator = contentItemMarkdown({ single: () => content }, () => "Body.");

        const result = generator({});

        expect(result).toContain("## Table of Contents");
        expect(result).toContain(`- [Introduction](${siteMetadata.siteUrl}/dsa/topic/graph#intro)`);
        expect(result).toContain(`  - [BFS](${siteMetadata.siteUrl}/dsa/topic/graph#bfs)`);
    });

    it("renders exactly 3 citable links for a DSA-exercise-shaped page (3 headings, 0 h3)", () => {
        const content = makeContent({
            slug: { formatted: "/dsa/topic/graph/exercise/word-ladder", params: {} },
            headings: [
                heading(2, "problem-summary", "Problem Summary"),
                heading(2, "techniques", "Techniques"),
                heading(2, "solution", "Solution"),
            ],
        });
        const generator = contentItemMarkdown({ single: () => content }, () => "Body.");

        const result = generator({}) ?? "";

        expect(result.match(/^- \[/gm)).toHaveLength(3);
        expect(result).toContain(`[Solution](${siteMetadata.siteUrl}/dsa/topic/graph/exercise/word-ladder#solution)`);
    });

    it("does not crash and renders no outline when headings is missing entirely (hand-built mock content)", () => {
        const content = { ...makeContent(), headings: undefined } as unknown as Content;
        const generator = contentItemMarkdown({ single: () => content }, () => "Body.");

        expect(() => generator({})).not.toThrow();
        expect(generator({})).not.toContain("## Table of Contents");
    });
});
