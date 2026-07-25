import { describe, it, expect, vi } from "vitest";

const { mockGetPosts } = vi.hoisted(() => ({
    mockGetPosts: vi.fn(),
}));

vi.mock("@/lib/content/posts/posts", () => ({
    posts: { list: mockGetPosts },
}));

import { GET } from "./route";

const makeFakePost = (slug: string, title: string) => ({
    slug: { formatted: `/blog/post/2024/01/01/${slug}` },
    frontmatter: {
        title,
        description: `Description for ${title}`,
        date: { formatted: "2024-01-01" },
        image: "/test-image.jpg",
    },
});

describe("GET /rss.xml", () => {
    describe("response shape", () => {
        it("returns 200 with application/rss+xml content-type", async () => {
            mockGetPosts.mockReturnValue([]);

            const response = await GET();
            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toBe("application/rss+xml");
        });

        it("returns well-formed RSS containing the site title", async () => {
            mockGetPosts.mockReturnValue([]);

            const response = await GET();
            const body = await response.text();
            expect(body).toContain("<rss");
            expect(body).toContain("Fabrizio Duroni");
        });

        it("includes a post item in the feed", async () => {
            mockGetPosts.mockReturnValue([makeFakePost("my-post", "My Great Post")]);

            const response = await GET();
            const body = await response.text();
            expect(body).toContain("My Great Post");
            expect(body).toContain("/blog/post/2024/01/01/my-post");
        });

        it("includes multiple posts when available", async () => {
            mockGetPosts.mockReturnValue([
                makeFakePost("first-post", "First Post"),
                makeFakePost("second-post", "Second Post"),
            ]);

            const response = await GET();
            const body = await response.text();
            expect(body).toContain("First Post");
            expect(body).toContain("Second Post");
        });
    });
});
