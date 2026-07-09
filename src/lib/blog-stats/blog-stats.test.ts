import { describe, it, expect, vi } from "vitest";
import { Content } from "@/types/content/content";
import { Author, AuthorSummary } from "@/types/content/author";
import { Tag } from "@/types/content/tag";
import { authorHref, ownerAuthorId } from "@/lib/content/authors/author-slug";

const { mockGetPosts, mockGetTags, mockGetAuthorsWithPosts } = vi.hoisted(() => ({
    mockGetPosts: vi.fn(),
    mockGetTags: vi.fn(),
    mockGetAuthorsWithPosts: vi.fn(),
}));

vi.mock("@/lib/content/posts/posts", () => ({
    getPosts: mockGetPosts,
    getTags: mockGetTags,
    getAuthorsWithPosts: mockGetAuthorsWithPosts,
}));

import {
    computeAuthorDistribution,
    computeHeadlineTotals,
    computePostsPerYear,
    computeTagDistribution,
    getBlogStats,
} from "./blog-stats";

const makeAuthor = (id: string, name: string): Author => ({
    id,
    name,
    linkedinUrl: "",
    image: "",
    imageLarge: "",
});

const makePost = (year: number, words: number, minutes: number, tags: string[] = [], authors: Author[] = []): Content =>
    ({
        slug: { formatted: `/post-${year}-${words}-${minutes}`, params: {} },
        frontmatter: {
            title: "title",
            description: "",
            tags,
            authors,
            date: { year, month: 1, day: 1, formatted: `${year}-01-01` },
            image: "",
        },
        readingTime: { text: "", minutes, time: minutes * 60000, words },
        contentFileRelativePath: "",
        content: "",
    }) as Content;

describe("blog-stats", () => {
    describe("computeHeadlineTotals", () => {
        it("returns all zeros for an empty posts list", () => {
            expect(computeHeadlineTotals([])).toEqual({
                totalPosts: 0,
                totalWords: 0,
                totalReadingMinutes: 0,
                yearsActive: 0,
                authorCount: 0,
                tagCount: 0,
            });
        });

        it("computes totals across multiple posts with multi-author posts", () => {
            const author1 = makeAuthor("a1", "Author One");
            const author2 = makeAuthor("a2", "Author Two");
            const posts = [
                makePost(2020, 100, 1, ["react"], [author1]),
                makePost(2022, 200, 2, ["react", "node"], [author1, author2]),
            ];

            expect(computeHeadlineTotals(posts, 2022)).toEqual({
                totalPosts: 2,
                totalWords: 300,
                totalReadingMinutes: 3,
                yearsActive: 3,
                authorCount: 2,
                tagCount: 2,
            });
        });

        it("treats a single-year blog as one year active", () => {
            const posts = [makePost(2024, 100, 1)];

            expect(computeHeadlineTotals(posts, 2024).yearsActive).toBe(1);
        });

        it("extends years-active to the current year even without a post this year", () => {
            const posts = [makePost(2020, 100, 1)];

            expect(computeHeadlineTotals(posts, 2026).yearsActive).toBe(7);
        });

        it("rounds the summed fractional reading minutes", () => {
            const posts = [makePost(2024, 100, 1.4), makePost(2024, 100, 1.4)];

            expect(computeHeadlineTotals(posts).totalReadingMinutes).toBe(3);
        });
    });

    describe("computePostsPerYear", () => {
        it("returns an empty array for no posts", () => {
            expect(computePostsPerYear([])).toEqual([]);
        });

        it("counts posts per year ascending, without filling gap years", () => {
            const posts = [makePost(2023, 0, 0), makePost(2020, 0, 0), makePost(2023, 0, 0)];

            expect(computePostsPerYear(posts)).toEqual([
                { year: 2020, count: 1 },
                { year: 2023, count: 2 },
            ]);
        });

        it("returns a single entry for a single-year blog", () => {
            const posts = [makePost(2024, 0, 0)];

            expect(computePostsPerYear(posts)).toEqual([{ year: 2024, count: 1 }]);
        });
    });

    describe("computeTagDistribution", () => {
        const tags: Tag[] = [
            { tagValue: "react", count: 5, tagSlugText: "react", slug: "/blog/tag/react" },
            { tagValue: "node", count: 8, tagSlugText: "node", slug: "/blog/tag/node" },
            { tagValue: "css", count: 1, tagSlugText: "css", slug: "/blog/tag/css" },
        ];

        it("returns an empty array for no tags", () => {
            expect(computeTagDistribution([], 10)).toEqual([]);
        });

        it("sorts tags by post count descending", () => {
            expect(computeTagDistribution(tags, 10)).toEqual([
                { tag: "node", count: 8, href: "/blog/tag/node" },
                { tag: "react", count: 5, href: "/blog/tag/react" },
                { tag: "css", count: 1, href: "/blog/tag/css" },
            ]);
        });

        it("caps the result exactly at the given limit", () => {
            expect(computeTagDistribution(tags, 2)).toEqual([
                { tag: "node", count: 8, href: "/blog/tag/node" },
                { tag: "react", count: 5, href: "/blog/tag/react" },
            ]);
        });

        it("returns every tag when the limit exceeds the tag count", () => {
            expect(computeTagDistribution(tags, 100)).toHaveLength(3);
        });

        it("breaks ties on equal counts alphabetically by tag value", () => {
            const tiedTags: Tag[] = [
                { tagValue: "zeta", count: 4, tagSlugText: "zeta", slug: "/blog/tag/zeta" },
                { tagValue: "alpha", count: 4, tagSlugText: "alpha", slug: "/blog/tag/alpha" },
                { tagValue: "mu", count: 4, tagSlugText: "mu", slug: "/blog/tag/mu" },
            ];

            expect(computeTagDistribution(tiedTags, 10)).toEqual([
                { tag: "alpha", count: 4, href: "/blog/tag/alpha" },
                { tag: "mu", count: 4, href: "/blog/tag/mu" },
                { tag: "zeta", count: 4, href: "/blog/tag/zeta" },
            ]);
        });
    });

    describe("computeAuthorDistribution", () => {
        it("returns an empty array for no authors", () => {
            expect(computeAuthorDistribution([])).toEqual([]);
        });

        it("sorts authors by post count descending", () => {
            const authors: AuthorSummary[] = [
                { author: makeAuthor("a1", "Author One"), postCount: 2 },
                { author: makeAuthor("a2", "Author Two"), postCount: 5 },
            ];

            expect(computeAuthorDistribution(authors)).toEqual([
                { author: "Author Two", count: 5, href: authorHref("a2") },
                { author: "Author One", count: 2, href: authorHref("a1") },
            ]);
        });

        it("breaks ties on equal post counts alphabetically by author name", () => {
            const authors: AuthorSummary[] = [
                { author: makeAuthor("a1", "Zeta Author"), postCount: 3 },
                { author: makeAuthor("a2", "Alpha Author"), postCount: 3 },
            ];

            expect(computeAuthorDistribution(authors)).toEqual([
                { author: "Alpha Author", count: 3, href: authorHref("a2") },
                { author: "Zeta Author", count: 3, href: authorHref("a1") },
            ]);
        });

        it("excludes the given author id, keeping the remaining ordering", () => {
            const authors: AuthorSummary[] = [
                { author: makeAuthor(ownerAuthorId, "Fabrizio Duroni"), postCount: 93 },
                { author: makeAuthor("a2", "Author Two"), postCount: 5 },
                { author: makeAuthor("a3", "Author Three"), postCount: 2 },
            ];

            expect(computeAuthorDistribution(authors, ownerAuthorId)).toEqual([
                { author: "Author Two", count: 5, href: authorHref("a2") },
                { author: "Author Three", count: 2, href: authorHref("a3") },
            ]);
        });

        it("keeps every author when no exclude id is given", () => {
            const authors: AuthorSummary[] = [{ author: makeAuthor(ownerAuthorId, "Fabrizio Duroni"), postCount: 93 }];

            expect(computeAuthorDistribution(authors)).toEqual([
                { author: "Fabrizio Duroni", count: 93, href: authorHref(ownerAuthorId) },
            ]);
        });
    });

    describe("getBlogStats", () => {
        it("wires the headline, posts-per-year, tag, and external-author aggregates from the content getters", () => {
            const author = makeAuthor("a1", "Author One");
            const posts = [makePost(2023, 100, 1, ["react"], [author])];
            const tags: Tag[] = [{ tagValue: "react", count: 1, tagSlugText: "react", slug: "/blog/tag/react" }];
            const authorsWithPosts: AuthorSummary[] = [{ author, postCount: 1 }];

            mockGetPosts.mockReturnValue(posts);
            mockGetTags.mockReturnValue(tags);
            mockGetAuthorsWithPosts.mockReturnValue(authorsWithPosts);

            expect(getBlogStats()).toEqual({
                headline: computeHeadlineTotals(posts),
                postsPerYear: computePostsPerYear(posts),
                tagDistribution: computeTagDistribution(tags, 10),
                externalAuthorDistribution: computeAuthorDistribution(authorsWithPosts, ownerAuthorId),
            });
        });

        it("excludes the site owner from the external author distribution", () => {
            const owner = makeAuthor(ownerAuthorId, "Fabrizio Duroni");
            const external = makeAuthor("a2", "Author Two");
            const posts = [makePost(2023, 100, 1, ["react"], [owner, external])];
            const tags: Tag[] = [{ tagValue: "react", count: 1, tagSlugText: "react", slug: "/blog/tag/react" }];
            const authorsWithPosts: AuthorSummary[] = [
                { author: owner, postCount: 93 },
                { author: external, postCount: 5 },
            ];

            mockGetPosts.mockReturnValue(posts);
            mockGetTags.mockReturnValue(tags);
            mockGetAuthorsWithPosts.mockReturnValue(authorsWithPosts);

            expect(getBlogStats().externalAuthorDistribution).toEqual([
                { author: "Author Two", count: 5, href: authorHref("a2") },
            ]);
        });
    });
});
