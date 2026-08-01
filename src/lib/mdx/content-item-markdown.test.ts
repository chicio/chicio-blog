import { describe, it, expect } from "vitest";
import { contentItemMarkdown } from "./content-item-markdown";
import { siteMetadata } from "@/types/configuration/site-metadata";
import type { Content } from "@/types/content/content";

/**
 * Headings are no longer a precomputed field on `Content` (see the doc comment on `Content` in
 * `types/content/content.ts`) — `contentItemMarkdown` derives them from `content.content` via
 * `extractHeadings`. These tests exercise that real derivation with real markdown headings, rather than
 * injecting a synthetic `headings` array, so the ids below are `extractHeadings`'s actual github-slugger
 * output for the given heading text (e.g. `## Introduction` slugs to `#introduction`).
 */
const makeContent = (overrides: Partial<Content> = {}): Content => ({
    frontmatter: { title: "Title", description: "Description", tags: [], authors: [], date: { year: 2024, month: 1, day: 1, formatted: "2024-01-01" }, image: "" },
    slug: { formatted: "/some/slug", params: {} },
    readingTime: { text: "", minutes: 0, time: 0, words: 0 },
    contentFileRelativePath: "",
    content: "",
    ...overrides,
});

describe("contentItemMarkdown", () => {
    it("returns null when the section has no content for the given params", () => {
        const generator = contentItemMarkdown({ single: () => undefined }, () => "");

        expect(generator({})).toBeNull();
    });

    it("renders no outline when there are fewer than 2 headings", () => {
        const content = makeContent({ content: "## One\n\nSome body text." });
        const generator = contentItemMarkdown({ single: () => content }, () => "Body.");

        expect(generator({})).not.toContain("## Table of Contents");
    });

    it("renders the outline as full citable deep links when there are 2 or more headings", () => {
        const content = makeContent({
            slug: { formatted: "/dsa/topic/graph", params: {} },
            content: "## Introduction\n\nIntro text.\n\n### BFS\n\nBFS text.",
        });
        const generator = contentItemMarkdown({ single: () => content }, () => "Body.");

        const result = generator({});

        expect(result).toContain("## Table of Contents");
        expect(result).toContain(`- [Introduction](${siteMetadata.siteUrl}/dsa/topic/graph#introduction)`);
        expect(result).toContain(`  - [BFS](${siteMetadata.siteUrl}/dsa/topic/graph#bfs)`);
    });

    it("renders exactly 3 citable links for a DSA-exercise-shaped page (3 headings, 0 h3)", () => {
        const content = makeContent({
            slug: { formatted: "/dsa/topic/graph/exercise/word-ladder", params: {} },
            content:
                "## Problem Summary\n\nSummary text.\n\n## Techniques\n\nTechniques text.\n\n## Solution\n\nSolution text.",
        });
        const generator = contentItemMarkdown({ single: () => content }, () => "Body.");

        const result = generator({}) ?? "";

        expect(result.match(/^- \[/gm)).toHaveLength(3);
        expect(result).toContain(`[Solution](${siteMetadata.siteUrl}/dsa/topic/graph/exercise/word-ladder#solution)`);
    });

    it("renders no outline when there are no headings at all", () => {
        const content = makeContent({ content: "Just a paragraph, no headings." });
        const generator = contentItemMarkdown({ single: () => content }, () => "Body.");

        expect(generator({})).not.toContain("## Table of Contents");
    });
});
