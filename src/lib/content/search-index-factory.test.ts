import { describe, it, expect } from "vitest";
import { createSearchIndex } from "./search-index-factory";
import type { Content } from "@/types/content/content";

const makeContent = (overrides: Partial<Content> = {}): Content => ({
    slug: { formatted: "/blog/post/2024/01/01/test-post", params: {} },
    frontmatter: {
        title: "Test Post",
        description: "A test post about React",
        tags: ["react", "typescript"],
        authors: [{ name: "Fabrizio Duroni", url: "https://example.com", image: "/img.jpg" }],
        date: { year: 2024, month: 1, day: 1, formatted: "2024-01-01" },
        image: "/post-image.jpg",
    },
    readingTime: { text: "5 min read", minutes: 5, time: 300000, words: 1000 },
    contentFileRelativePath: "src/content/blog/2024/01/01/test-post/content.mdx",
    content: "Full content of the post",
    ...overrides,
});

describe("createSearchIndex", () => {
    it("creates an index that finds documents by title", () => {
        const content = makeContent();
        const index = createSearchIndex([content]);

        const results = index.search("Test Post", { fields: { title: {} } });
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].ref).toBe("/blog/post/2024/01/01/test-post");
    });

    it("creates an index that finds documents by tag", () => {
        const content = makeContent();
        const index = createSearchIndex([content]);

        const results = index.search("react", { fields: { tags: {} } });
        expect(results.length).toBeGreaterThan(0);
    });

    it("creates an index that finds documents by description", () => {
        const content = makeContent();
        const index = createSearchIndex([content]);

        const results = index.search("React", { fields: { description: {} } });
        expect(results.length).toBeGreaterThan(0);
    });

    it("uses the formatted slug as the document ref", () => {
        const content = makeContent();
        const index = createSearchIndex([content]);

        const doc = index.documentStore.getDoc("/blog/post/2024/01/01/test-post");
        expect(doc).toBeDefined();
        expect(doc?.slug).toBe("/blog/post/2024/01/01/test-post");
    });

    it("indexes multiple documents and both are findable by their distinct tags", () => {
        const content1 = makeContent();
        const content2 = makeContent({
            slug: { formatted: "/blog/post/2024/02/01/another-post", params: {} },
            frontmatter: {
                title: "Another Post",
                description: "About Next.js routing",
                tags: ["nextjs"],
                authors: [{ name: "Fabrizio Duroni", url: "https://example.com", image: "/img.jpg" }],
                date: { year: 2024, month: 2, day: 1, formatted: "2024-02-01" },
                image: "/another-image.jpg",
            },
        });

        const index = createSearchIndex([content1, content2]);
        const reactTagResults = index.search("react", { fields: { tags: {} } });
        const nextjsTagResults = index.search("nextjs", { fields: { tags: {} } });

        expect(reactTagResults.length).toBeGreaterThan(0);
        expect(nextjsTagResults.length).toBeGreaterThan(0);
    });

    it("returns an empty index when given no content", () => {
        const index = createSearchIndex([]);
        const results = index.search("anything");
        expect(results).toHaveLength(0);
    });
});
