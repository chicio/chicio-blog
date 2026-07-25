import { describe, it, expect, vi } from "vitest";

const { mockGetPosts, mockGetTags, mockGetPostsTotalPages, mockGetIndexableContent } = vi.hoisted(() => ({
    mockGetPosts: vi.fn(),
    mockGetTags: vi.fn(),
    mockGetPostsTotalPages: vi.fn(),
    mockGetIndexableContent: vi.fn(),
}));

vi.mock("@/lib/content/posts/posts", () => ({
    posts: { list: mockGetPosts },
    getTags: mockGetTags,
    getPostsTotalPages: mockGetPostsTotalPages,
}));

vi.mock("@/lib/content/indexable-content", () => ({
    getIndexableContent: mockGetIndexableContent,
}));

import sitemap from "./sitemap";

const makeFakePost = (slug: string) => ({
    slug: { formatted: `/blog/post/2024/01/01/${slug}` },
    frontmatter: {
        date: { formatted: "2024-01-01" },
        image: "/test-image.jpg",
        title: "Test Post",
    },
});

const makeFakeTag = (tagValue: string) => ({
    tagValue,
    slug: `/blog/tag/${tagValue}`,
    count: 3,
    tagSlugText: tagValue,
});

describe("sitemap", () => {
    describe("output shape", () => {
        it("includes the homepage entry", () => {
            mockGetPostsTotalPages.mockReturnValue(1);
            mockGetPosts.mockReturnValue([makeFakePost("my-post")]);
            mockGetTags.mockReturnValue([makeFakeTag("typescript")]);
            mockGetIndexableContent.mockReturnValue([makeFakePost("my-post")]);

            const entries = sitemap();
            const urls = entries.map((e) => e.url);
            expect(urls).toContain("https://www.fabrizioduroni.it");
        });

        it("includes the blog home entry", () => {
            mockGetPostsTotalPages.mockReturnValue(1);
            mockGetPosts.mockReturnValue([]);
            mockGetTags.mockReturnValue([]);
            mockGetIndexableContent.mockReturnValue([]);

            const entries = sitemap();
            const urls = entries.map((e) => e.url);
            expect(urls).toContain("https://www.fabrizioduroni.it/blog");
        });

        it("generates pagination pages based on total pages", () => {
            mockGetPostsTotalPages.mockReturnValue(3);
            mockGetPosts.mockReturnValue([]);
            mockGetTags.mockReturnValue([]);
            mockGetIndexableContent.mockReturnValue([]);

            const entries = sitemap();
            const paginationUrls = entries
                .map((e) => e.url)
                .filter((u) => u.includes("/blog/posts/"));
            expect(paginationUrls).toHaveLength(3);
            expect(paginationUrls).toContain("https://www.fabrizioduroni.it/blog/posts/1");
            expect(paginationUrls).toContain("https://www.fabrizioduroni.it/blog/posts/3");
        });

        it("includes tag entries for each tag", () => {
            mockGetPostsTotalPages.mockReturnValue(1);
            mockGetPosts.mockReturnValue([]);
            mockGetTags.mockReturnValue([makeFakeTag("react"), makeFakeTag("typescript")]);
            mockGetIndexableContent.mockReturnValue([]);

            const entries = sitemap();
            const urls = entries.map((e) => e.url);
            expect(urls).toContain("https://www.fabrizioduroni.it/blog/tag/react");
            expect(urls).toContain("https://www.fabrizioduroni.it/blog/tag/typescript");
        });

        it("includes indexable content entries", () => {
            mockGetPostsTotalPages.mockReturnValue(1);
            mockGetPosts.mockReturnValue([]);
            mockGetTags.mockReturnValue([]);
            mockGetIndexableContent.mockReturnValue([makeFakePost("hello-world")]);

            const entries = sitemap();
            const urls = entries.map((e) => e.url);
            expect(urls).toContain("https://www.fabrizioduroni.it/blog/post/2024/01/01/hello-world");
        });
    });
});
