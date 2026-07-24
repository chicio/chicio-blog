import { describe, it, expect, vi } from "vitest";

const { mockListPosts, mockGetTags, mockListDsaTopics } = vi.hoisted(() => ({
    mockListPosts: vi.fn(),
    mockGetTags: vi.fn(),
    mockListDsaTopics: vi.fn(),
}));

vi.mock("@/lib/content/posts/posts", () => ({
    posts: { list: mockListPosts },
    getTags: mockGetTags,
}));

vi.mock("@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms", () => ({
    topics: { list: mockListDsaTopics },
}));

import { GET } from "./route";

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
