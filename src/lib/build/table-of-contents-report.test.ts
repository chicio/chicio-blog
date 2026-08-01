import { describe, it, expect, vi, beforeEach } from "vitest";
import { slugs } from "@/types/configuration/slug";

const { mockContentRegistry } = vi.hoisted(() => ({
    mockContentRegistry: [] as unknown[],
}));

vi.mock("@/lib/content/registry", () => ({
    get contentRegistry() {
        return mockContentRegistry;
    },
}));

import { reportTableOfContentsGaps } from "./table-of-contents-report";

/**
 * Headings are no longer a precomputed field on `Content` — `reportTableOfContentsGaps` derives them
 * from `content.content` via `extractHeadings` (see the doc comment on `Content` in
 * `types/content/content.ts`). Each generated h2 needs distinct text so `extractHeadings`'s github-slugger
 * doesn't need dedupe suffixes to reach the requested count.
 */
const contentWith = (slug: string, headingsCount: number) => ({
    slug: { formatted: slug, params: {} },
    content: Array.from({ length: headingsCount }, (_, index) => `## Heading ${index}`).join("\n\n"),
});

beforeEach(() => {
    mockContentRegistry.length = 0;
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("reportTableOfContentsGaps", () => {
    it("logs success when every blog post / DSA topic clears the gate", () => {
        mockContentRegistry.push({
            slug: slugs.blog.blogPost,
            content: () => [contentWith("/blog/post/a", 3), contentWith("/blog/post/b", 5)],
        });

        reportTableOfContentsGaps();

        expect(console.log).toHaveBeenCalledWith("✅ Every content-backed page clears the table-of-contents gate.");
    });

    it("lists every page slug that falls below the 3-heading gate", () => {
        mockContentRegistry.push({
            slug: slugs.dataStructuresAndAlgorithms.topic,
            content: () => [contentWith("/dsa/topic/a", 1), contentWith("/dsa/topic/b", 3)],
        });

        reportTableOfContentsGaps();

        expect(console.log).toHaveBeenCalledWith(
            "⚠️  1 page(s) below the table-of-contents gate (fewer than 3 h2/h3 headings):",
        );
        expect(console.log).toHaveBeenCalledWith("   - /dsa/topic/a");
    });

    it("ignores aggregate entries that have no content() accessor", () => {
        mockContentRegistry.push({ slug: slugs.blog.home, markdown: () => "" });

        expect(() => reportTableOfContentsGaps()).not.toThrow();
        expect(console.log).toHaveBeenCalledWith("✅ Every content-backed page clears the table-of-contents gate.");
    });

    it("ignores content types whose consumer never wires the on-page TOC (e.g. DSA exercises, videogames)", () => {
        mockContentRegistry.push({
            slug: slugs.dataStructuresAndAlgorithms.exercise,
            content: () => [contentWith("/dsa/topic/a/exercise/one", 0)],
        });
        mockContentRegistry.push({
            slug: slugs.videogames.game,
            content: () => [contentWith("/videogames/console/nes/game/one", 0)],
        });

        reportTableOfContentsGaps();

        expect(console.log).toHaveBeenCalledWith("✅ Every content-backed page clears the table-of-contents gate.");
    });

    it("never throws, even if reading the registry blows up", () => {
        mockContentRegistry.push({
            slug: slugs.blog.blogPost,
            content: () => {
                throw new Error("boom");
            },
        });

        expect(() => reportTableOfContentsGaps()).not.toThrow();
        expect(console.error).toHaveBeenCalled();
    });
});
