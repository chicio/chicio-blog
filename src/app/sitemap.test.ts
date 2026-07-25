import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGetTags, mockGetPostsTotalPages, mockGetAuthorsWithPosts, mockContent, mockGalleryContent, mockCollectionParams } = vi.hoisted(
    () => ({
        mockGetTags: vi.fn(),
        mockGetPostsTotalPages: vi.fn(),
        mockGetAuthorsWithPosts: vi.fn(),
        mockContent: vi.fn(),
        mockGalleryContent: vi.fn(),
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
        { slug: "/gallery", markdown: vi.fn(), content: mockGalleryContent },
        { slug: "/things/[thing]", markdown: vi.fn(), params: mockCollectionParams, content: mockContent },
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
    mockGalleryContent.mockReturnValue([
        {
            slug: { formatted: "/gallery", params: {} },
            frontmatter: { date: { formatted: "2018-11-15" }, image: "/media/content/art/featured.png", title: "Art" },
        },
    ]);
    mockContent.mockReturnValue([
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

        it("takes the date and image of a content item from its own frontmatter", () => {
            const entry = findEntry("/things/one");

            expect(entry?.lastModified).toEqual(new Date("2024-03-04"));
            expect(entry?.images).toEqual([url("/one.jpg")]);
        });

        it("falls back to the site featured image for a page that carries no content", () => {
            expect(findEntry("/plain-page")?.images).toEqual([url(siteMetadata.featuredImage)]);
        });

        it("takes a page's image from its frontmatter rather than from a second declaration", () => {
            expect(findEntry("/gallery")?.images).toEqual([url("/media/content/art/featured.png")]);
        });

        it("takes a page's date from its frontmatter, not the build time", () => {
            expect(findEntry("/gallery")?.lastModified).toEqual(new Date("2018-11-15"));
        });

        it("expands a collection from its content rather than from its params", () => {
            sitemap();

            expect(mockContent).toHaveBeenCalled();
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
