import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGetTags, mockGetPostsTotalPages, mockGetAuthorsWithPosts, mockIndexed, mockCollectionParams } = vi.hoisted(
    () => ({
        mockGetTags: vi.fn(),
        mockGetPostsTotalPages: vi.fn(),
        mockGetAuthorsWithPosts: vi.fn(),
        mockIndexed: vi.fn(),
        mockCollectionParams: vi.fn(),
    }),
);

vi.mock("@/lib/content/posts/posts", () => ({
    getTags: mockGetTags,
    getPostsTotalPages: mockGetPostsTotalPages,
    getAuthorsWithPosts: mockGetAuthorsWithPosts,
}));

/**
 * The sitemap's own job is composing registry entries and the post-derived listings into URLs, so it is
 * tested against a small fake registry. What the real registry contains is asserted in registry.test.ts.
 */
vi.mock("@/lib/content/registry", () => ({
    contentRegistry: [
        { slug: "/", markdown: vi.fn() },
        { slug: "/plain-page", markdown: vi.fn() },
        { slug: "/gallery", markdown: vi.fn(), sitemapImage: "/art-featured.jpg" },
        { slug: "/things/[thing]", markdown: vi.fn(), params: mockCollectionParams, indexed: mockIndexed },
    ],
}));

import sitemap from "./sitemap";
import { siteMetadata } from "@/types/configuration/site-metadata";

const url = (path: string) => `${siteMetadata.siteUrl}${path}`;

const findEntry = (path: string) => sitemap().find((entry) => entry.url === url(path));

beforeEach(() => {
    vi.clearAllMocks();
    mockGetTags.mockReturnValue([]);
    mockGetPostsTotalPages.mockReturnValue(0);
    mockGetAuthorsWithPosts.mockReturnValue([]);
    mockCollectionParams.mockReturnValue([{ thing: "one" }]);
    mockIndexed.mockReturnValue([
        {
            slug: { formatted: "/things/one", params: { thing: "one" } },
            frontmatter: { date: { formatted: "2024-03-04" }, image: "/one.jpg", title: "One" },
        },
    ]);
});

describe("sitemap", () => {
    describe("registry content", () => {
        it("announces the homepage without a trailing slash", () => {
            expect(findEntry("")).toBeDefined();
        });

        it("announces a single page from the registry", () => {
            expect(findEntry("/plain-page")).toBeDefined();
        });

        it("takes the date and image of an indexed item from its own frontmatter", () => {
            const entry = findEntry("/things/one");

            expect(entry?.lastModified).toEqual(new Date("2024-03-04"));
            expect(entry?.images).toEqual([url("/one.jpg")]);
        });

        it("falls back to the site featured image for a page that carries no content", () => {
            expect(findEntry("/plain-page")?.images).toEqual([url(siteMetadata.featuredImage)]);
        });

        it("honours an entry's own sitemap image", () => {
            expect(findEntry("/gallery")?.images).toEqual([url("/art-featured.jpg")]);
        });

        it("expands an indexed collection from its content rather than from its params", () => {
            sitemap();

            expect(mockIndexed).toHaveBeenCalled();
            expect(mockCollectionParams).not.toHaveBeenCalled();
        });
    });

    describe("post-derived listings", () => {
        it("announces the archive, tags and authors listings", () => {
            expect(findEntry("/blog/archive")).toBeDefined();
            expect(findEntry("/blog/tags")).toBeDefined();
            expect(findEntry("/blog/authors")).toBeDefined();
        });

        it("announces one entry per pagination page, starting at one", () => {
            mockGetPostsTotalPages.mockReturnValue(3);

            expect(findEntry("/blog/posts/1")).toBeDefined();
            expect(findEntry("/blog/posts/3")).toBeDefined();
            expect(findEntry("/blog/posts/4")).toBeUndefined();
        });

        it("announces every tag", () => {
            mockGetTags.mockReturnValue([
                { tagValue: "swift", slug: "/blog/tag/swift", count: 2, tagSlugText: "swift" },
            ]);

            expect(findEntry("/blog/tag/swift")).toBeDefined();
        });

        it("announces every author who has posts", () => {
            mockGetAuthorsWithPosts.mockReturnValue([{ author: { id: "ada_lovelace" }, postCount: 2 }]);

            expect(findEntry("/blog/author/ada-lovelace")).toBeDefined();
        });

        it("leaves out the site owner, whose author page is about-me instead", () => {
            mockGetAuthorsWithPosts.mockReturnValue([{ author: { id: "fabrizio_duroni" }, postCount: 9 }]);

            expect(findEntry("/blog/author/fabrizio-duroni")).toBeUndefined();
        });
    });

    describe("output", () => {
        it("gives every entry an absolute url and a priority", () => {
            mockGetPostsTotalPages.mockReturnValue(1);

            sitemap().forEach((entry) => {
                expect(entry.url.startsWith(siteMetadata.siteUrl)).toBe(true);
                expect(entry.priority).toBe(1);
            });
        });

        it("announces no url twice", () => {
            mockGetPostsTotalPages.mockReturnValue(2);
            const urls = sitemap().map((entry) => entry.url);

            expect(new Set(urls).size).toBe(urls.length);
        });
    });
});
