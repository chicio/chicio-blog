import { describe, it, expect, vi } from "vitest";

const { mockListPosts, mockGetTags, mockListDsaTopics, mockPageContent } = vi.hoisted(() => ({
    mockListPosts: vi.fn(),
    mockGetTags: vi.fn(),
    mockListDsaTopics: vi.fn(),
    mockPageContent: vi.fn(),
}));

vi.mock("@/lib/content/posts/posts", () => ({
    posts: { list: mockListPosts },
    getTags: mockGetTags,
}));

vi.mock("@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms", () => ({
    topics: { list: mockListDsaTopics },
}));

/**
 * The page list comes from the registry, so a fake one proves the derivation without depending on how
 * many pages the site currently has. The real registry's contents are asserted in registry.test.ts.
 */
vi.mock("@/lib/content/registry", () => ({
    contentRegistry: [
        { slug: "/", markdown: vi.fn() },
        { slug: "/videogames", markdown: vi.fn() },
        { slug: "/an-mdx-page", markdown: vi.fn(), content: mockPageContent },
        { slug: "/blog/post/[year]/[month]/[day]/[slug]", markdown: vi.fn(), params: vi.fn(() => []) },
    ],
}));

import { GET } from "./route";
import { siteMetadata } from "@/types/configuration/site-metadata";

const makeFakePost = (slug: string, title: string) => ({
    slug: { formatted: `/blog/post/2024/01/01/${slug}` },
    frontmatter: {
        title,
        description: `Description for ${title}`,
    },
});

const makeFakeTag = (tagValue: string, count: number) => ({
    tagValue,
    slug: `/blog/tag/${tagValue}`,
    count,
    tagSlugText: tagValue,
});

const makeFakeDsaTopic = (topic: string) => ({
    slug: { formatted: `/data-structures-and-algorithms/topic/${topic}` },
    frontmatter: {
        title: `DSA: ${topic}`,
        description: `Learn about ${topic}`,
    },
});

describe("GET /llms.txt", () => {
    describe("response shape", () => {
        it("returns 200 with text/plain content-type", async () => {
            mockListPosts.mockReturnValue([]);
            mockGetTags.mockReturnValue([]);
            mockListDsaTopics.mockReturnValue([]);

            const response = await GET();
            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
        });

        it("includes cache-control header", async () => {
            mockListPosts.mockReturnValue([]);
            mockGetTags.mockReturnValue([]);
            mockListDsaTopics.mockReturnValue([]);

            const response = await GET();
            expect(response.headers.get("Cache-Control")).toContain("max-age=3600");
        });
    });

    describe("content", () => {
        it("includes site title and description", async () => {
            mockListPosts.mockReturnValue([]);
            mockGetTags.mockReturnValue([]);
            mockListDsaTopics.mockReturnValue([]);

            const response = await GET();
            const text = await response.text();
            expect(text).toContain("Fabrizio Duroni");
            expect(text).toContain("Chicio Coding");
        });

        it("lists blog posts with links", async () => {
            mockListPosts.mockReturnValue([makeFakePost("my-post", "Awesome React Article")]);
            mockGetTags.mockReturnValue([]);
            mockListDsaTopics.mockReturnValue([]);

            const response = await GET();
            const text = await response.text();
            expect(text).toContain("Awesome React Article");
            expect(text).toContain("/blog/post/2024/01/01/my-post");
        });

        it("lists tags with post counts", async () => {
            mockListPosts.mockReturnValue([]);
            mockGetTags.mockReturnValue([makeFakeTag("typescript", 7)]);
            mockListDsaTopics.mockReturnValue([]);

            const response = await GET();
            const text = await response.text();
            expect(text).toContain("typescript");
            expect(text).toContain("7 posts");
        });

        it("links every single page the registry knows about, so a registered section is advertised", async () => {
            mockListPosts.mockReturnValue([]);
            mockGetTags.mockReturnValue([]);
            mockListDsaTopics.mockReturnValue([]);
            mockPageContent.mockReturnValue([]);

            const text = await (await GET()).text();

            expect(text).toContain(`(${siteMetadata.siteUrl}/videogames)`);
            expect(text).toContain(`(${siteMetadata.siteUrl}/an-mdx-page)`);
        });

        it("describes an MDX page with its own frontmatter title and description", async () => {
            mockListPosts.mockReturnValue([]);
            mockGetTags.mockReturnValue([]);
            mockListDsaTopics.mockReturnValue([]);
            mockPageContent.mockReturnValue([
                { slug: { formatted: "/an-mdx-page", params: {} }, frontmatter: { title: "Real Title", description: "Real description" } },
            ]);

            const text = await (await GET()).text();

            expect(text).toContain("[Real Title]");
            expect(text).toContain("Real description");
        });

        it("links the homepage without a trailing slash, and never stringifies a slug object", async () => {
            mockListPosts.mockReturnValue([]);
            mockGetTags.mockReturnValue([]);
            mockListDsaTopics.mockReturnValue([]);
            mockPageContent.mockReturnValue([]);

            const text = await (await GET()).text();

            expect(text).toContain(`[Home](${siteMetadata.siteUrl})`);
            expect(text).not.toContain("[object Object]");
        });

        it("does not expand a collection template into a page link", async () => {
            mockListPosts.mockReturnValue([]);
            mockGetTags.mockReturnValue([]);
            mockListDsaTopics.mockReturnValue([]);
            mockPageContent.mockReturnValue([]);

            const text = await (await GET()).text();

            expect(text).not.toContain("[year]");
        });

        it("lists DSA topics with links", async () => {
            mockListPosts.mockReturnValue([]);
            mockGetTags.mockReturnValue([]);
            mockListDsaTopics.mockReturnValue([makeFakeDsaTopic("binary-search")]);

            const response = await GET();
            const text = await response.text();
            expect(text).toContain("binary-search");
        });
    });
});
