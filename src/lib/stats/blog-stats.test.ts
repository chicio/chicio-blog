import { describe, it, expect, vi } from "vitest";
import { Content } from "@/types/content/content";
import { Author, AuthorSummary } from "@/types/content/author";
import { Tag } from "@/types/content/tag";

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

            expect(computeHeadlineTotals(posts)).toEqual({
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

            expect(computeHeadlineTotals(posts).yearsActive).toBe(1);
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
                { tag: "node", count: 8 },
                { tag: "react", count: 5 },
                { tag: "css", count: 1 },
            ]);
        });

        it("caps the result exactly at the given limit", () => {
            expect(computeTagDistribution(tags, 2)).toEqual([
                { tag: "node", count: 8 },
                { tag: "react", count: 5 },
            ]);
        });

        it("returns every tag when the limit exceeds the tag count", () => {
            expect(computeTagDistribution(tags, 100)).toHaveLength(3);
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
                { author: "Author Two", count: 5 },
                { author: "Author One", count: 2 },
            ]);
        });
    });

    describe("getBlogStats", () => {
        it("wires the headline, posts-per-year, tag, and author aggregates from the content getters", () => {
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
                authorDistribution: computeAuthorDistribution(authorsWithPosts),
            });
        });
    });
});
