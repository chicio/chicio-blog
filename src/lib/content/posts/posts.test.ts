import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGetAllContentFor, mockGetSingleContentBy } = vi.hoisted(() => ({
    mockGetAllContentFor: vi.fn(),
    mockGetSingleContentBy: vi.fn(),
}));

vi.mock("../content", () => ({
    getAllContentFor: mockGetAllContentFor,
    getSingleContentBy: mockGetSingleContentBy,
}));

import {
    aggregateAuthorsWithPosts,
    filterPostsForAuthor,
    findAuthorWithPostsBySlug,
    rankReadNextPosts,
    getPosts,
    getPostBy,
    groupArrayBy,
    getPostsTotalPages,
    getPostsPaginationFor,
    getTags,
    getPostsForTag,
    getAuthorsWithPosts,
    getAuthorWithPostsBySlug,
    getReadNextPosts,
} from "./posts";
import { Content } from "@/types/content/content";
import { Author } from "@/types/content/author";

const makePost = (slug: string, tags: string[], dateFormatted: string, authors: Author[] = []): Content =>
    ({
        slug: { formatted: slug, params: {} },
        frontmatter: {
            title: slug,
            description: "",
            tags,
            authors,
            date: { formatted: dateFormatted, year: 2024, month: 1, day: 1 },
            image: "",
        },
        readingTime: { text: "", minutes: 0, time: 0, words: 0 },
        contentFileRelativePath: "",
        content: "",
    }) as Content;

const makeAuthor = (id: string, name: string): Author => ({
    id,
    name,
    linkedinUrl: `https://www.linkedin.com/in/${id}/`,
    image: `/media/authors/${id}.jpg`,
});

beforeEach(() => {
    vi.clearAllMocks();
});

describe("rankReadNextPosts", () => {
    describe("ranking by shared tag count", () => {
        it("returns posts with more shared tags first", () => {
            const candidates = [
                makePost("post-a", ["react"], "2024-01-01"),
                makePost("post-b", ["react", "typescript", "nextjs"], "2024-01-02"),
                makePost("post-c", ["python"], "2024-01-03"),
            ];
            const result = rankReadNextPosts(["react", "typescript", "nextjs"], candidates, 2);
            expect(result[0].slug.formatted).toBe("post-b");
            expect(result[1].slug.formatted).toBe("post-a");
        });

        it("excludes posts with no shared tags when enough related posts exist", () => {
            const candidates = [
                makePost("post-a", ["react"], "2024-01-01"),
                makePost("post-b", ["react", "typescript"], "2024-01-02"),
                makePost("post-c", ["python"], "2024-01-03"),
            ];
            const result = rankReadNextPosts(["react", "typescript"], candidates, 2);
            expect(result.map((p) => p.slug.formatted)).toEqual(["post-b", "post-a"]);
        });
    });

    describe("tie-breaking by recency", () => {
        it("preserves candidate list order (recency) for posts with equal shared tag counts", () => {
            const candidates = [
                makePost("post-newer", ["react"], "2024-03-01"),
                makePost("post-older", ["react"], "2024-01-01"),
            ];
            const result = rankReadNextPosts(["react"], candidates, 2);
            expect(result[0].slug.formatted).toBe("post-newer");
            expect(result[1].slug.formatted).toBe("post-older");
        });
    });

    describe("fallback to most recent when fewer than limit share tags", () => {
        it("fills remaining slots with most recent non-related posts", () => {
            const candidates = [
                makePost("post-a", ["react"], "2024-03-01"),
                makePost("post-b", ["python"], "2024-02-01"),
                makePost("post-c", ["java"], "2024-01-01"),
            ];
            const result = rankReadNextPosts(["react"], candidates, 2);
            expect(result[0].slug.formatted).toBe("post-a");
            expect(result[1].slug.formatted).toBe("post-b");
        });

        it("fills all slots from fallback when no posts share any tags", () => {
            const candidates = [
                makePost("post-a", ["python"], "2024-03-01"),
                makePost("post-b", ["java"], "2024-02-01"),
                makePost("post-c", ["rust"], "2024-01-01"),
            ];
            const result = rankReadNextPosts(["react"], candidates, 2);
            expect(result[0].slug.formatted).toBe("post-a");
            expect(result[1].slug.formatted).toBe("post-b");
        });
    });

    describe("limit enforcement", () => {
        it("returns at most limit posts even when more are available", () => {
            const candidates = [
                makePost("post-a", ["react", "typescript"], "2024-03-01"),
                makePost("post-b", ["react"], "2024-02-01"),
                makePost("post-c", ["react"], "2024-01-01"),
            ];
            const result = rankReadNextPosts(["react"], candidates, 2);
            expect(result).toHaveLength(2);
        });

        it("returns fewer than limit when not enough candidates exist", () => {
            const candidates = [makePost("post-a", ["react"], "2024-01-01")];
            const result = rankReadNextPosts(["react"], candidates, 2);
            expect(result).toHaveLength(1);
        });
    });

    describe("edge cases", () => {
        it("returns empty array when candidates list is empty", () => {
            const result = rankReadNextPosts(["react"], [], 2);
            expect(result).toHaveLength(0);
        });

        it("handles current post with empty tags (no shared tags possible)", () => {
            const candidates = [
                makePost("post-a", ["react"], "2024-03-01"),
                makePost("post-b", ["typescript"], "2024-02-01"),
            ];
            const result = rankReadNextPosts([], candidates, 2);
            expect(result).toHaveLength(2);
            expect(result[0].slug.formatted).toBe("post-a");
            expect(result[1].slug.formatted).toBe("post-b");
        });
    });
});

describe("aggregateAuthorsWithPosts", () => {
    describe("counting", () => {
        it("counts one post per author", () => {
            const fabrizio = makeAuthor("fabrizio_duroni", "Fabrizio Duroni");
            const posts = [makePost("post-a", [], "2024-01-01", [fabrizio])];
            const result = aggregateAuthorsWithPosts(posts);
            expect(result).toHaveLength(1);
            expect(result[0].postCount).toBe(1);
        });

        it("accumulates the count across multiple posts by the same author", () => {
            const fabrizio = makeAuthor("fabrizio_duroni", "Fabrizio Duroni");
            const posts = [
                makePost("post-a", [], "2024-01-01", [fabrizio]),
                makePost("post-b", [], "2024-02-01", [fabrizio]),
            ];
            const result = aggregateAuthorsWithPosts(posts);
            expect(result).toHaveLength(1);
            expect(result[0].postCount).toBe(2);
        });

        it("counts each co-author of a post separately", () => {
            const fabrizio = makeAuthor("fabrizio_duroni", "Fabrizio Duroni");
            const francesco = makeAuthor("francesco_bonfadelli", "Francesco Bonfadelli");
            const posts = [makePost("post-a", [], "2024-01-01", [fabrizio, francesco])];
            const result = aggregateAuthorsWithPosts(posts);
            expect(result).toHaveLength(2);
            expect(result.every((entry) => entry.postCount === 1)).toBe(true);
        });
    });

    describe("sorting", () => {
        it("sorts authors alphabetically by name", () => {
            const francesco = makeAuthor("francesco_bonfadelli", "Francesco Bonfadelli");
            const alessandro = makeAuthor("alessandro_romano", "Alessandro Romano");
            const posts = [
                makePost("post-a", [], "2024-01-01", [francesco]),
                makePost("post-b", [], "2024-02-01", [alessandro]),
            ];
            const result = aggregateAuthorsWithPosts(posts);
            expect(result.map((entry) => entry.author.name)).toEqual([
                "Alessandro Romano",
                "Francesco Bonfadelli",
            ]);
        });
    });

    describe("edge cases", () => {
        it("returns an empty array when there are no posts", () => {
            expect(aggregateAuthorsWithPosts([])).toEqual([]);
        });

        it("excludes authors with zero posts (never encountered while walking posts)", () => {
            const fabrizio = makeAuthor("fabrizio_duroni", "Fabrizio Duroni");
            const posts = [makePost("post-a", [], "2024-01-01", [fabrizio])];
            const result = aggregateAuthorsWithPosts(posts);
            expect(result.some((entry) => entry.author.id === "antonino_gitto")).toBe(false);
        });
    });
});

describe("filterPostsForAuthor", () => {
    it("returns only posts authored by the given author id", () => {
        const fabrizio = makeAuthor("fabrizio_duroni", "Fabrizio Duroni");
        const francesco = makeAuthor("francesco_bonfadelli", "Francesco Bonfadelli");
        const posts = [
            makePost("post-a", [], "2024-01-01", [fabrizio]),
            makePost("post-b", [], "2024-02-01", [francesco]),
        ];
        const result = filterPostsForAuthor(posts, "fabrizio_duroni");
        expect(result.map((post) => post.slug.formatted)).toEqual(["post-a"]);
    });

    it("returns an empty array when the author has no posts", () => {
        const francesco = makeAuthor("francesco_bonfadelli", "Francesco Bonfadelli");
        const posts = [makePost("post-a", [], "2024-01-01", [francesco])];
        expect(filterPostsForAuthor(posts, "fabrizio_duroni")).toEqual([]);
    });
});

describe("findAuthorWithPostsBySlug", () => {
    it("resolves the author and their posts from the hyphenated slug", () => {
        const fabrizio = makeAuthor("fabrizio_duroni", "Fabrizio Duroni");
        const posts = [
            makePost("post-a", [], "2024-01-01", [fabrizio]),
            makePost("post-b", [], "2024-02-01", [fabrizio]),
        ];
        const result = findAuthorWithPostsBySlug(posts, "fabrizio-duroni");
        expect(result?.author.id).toBe("fabrizio_duroni");
        expect(result?.posts).toHaveLength(2);
    });

    it("returns undefined when no post matches the author slug", () => {
        const francesco = makeAuthor("francesco_bonfadelli", "Francesco Bonfadelli");
        const posts = [makePost("post-a", [], "2024-01-01", [francesco])];
        expect(findAuthorWithPostsBySlug(posts, "fabrizio-duroni")).toBeUndefined();
    });

    it("returns undefined for an empty post list", () => {
        expect(findAuthorWithPostsBySlug([], "fabrizio-duroni")).toBeUndefined();
    });
});

describe("getPosts", () => {
    it("sorts posts by date descending (most recent first)", () => {
        mockGetAllContentFor.mockReturnValue([
            makePost("post-jan", [], "2024-01-01"),
            makePost("post-mar", [], "2024-03-01"),
            makePost("post-feb", [], "2024-02-01"),
        ]);

        const result = getPosts();

        expect(result.map((post) => post.slug.formatted)).toEqual(["post-mar", "post-feb", "post-jan"]);
    });

    it("returns an empty array when there is no content", () => {
        mockGetAllContentFor.mockReturnValue([]);

        expect(getPosts()).toEqual([]);
    });
});

describe("getPostBy", () => {
    it("returns the content found by getSingleContentBy", () => {
        const post = makePost("post-a", [], "2024-01-01");
        mockGetSingleContentBy.mockReturnValue(post);

        expect(getPostBy({ slug: "post-a" })).toBe(post);
    });

    it("returns undefined when getSingleContentBy throws", () => {
        mockGetSingleContentBy.mockImplementation(() => {
            throw new Error("content not found");
        });

        expect(getPostBy({ slug: "missing" })).toBeUndefined();
    });
});

describe("groupArrayBy", () => {
    it("returns a single group when the array is shorter than the group size", () => {
        expect(groupArrayBy([1, 2], 5)).toEqual([[1, 2]]);
    });

    it("returns a single group when the array length equals the group size", () => {
        expect(groupArrayBy([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    });

    it("splits the array into groups of the given size when it is an exact multiple", () => {
        expect(groupArrayBy([1, 2, 3, 4], 2)).toEqual([
            [1, 2],
            [3, 4],
        ]);
    });

    it("puts the remainder in the last, shorter group", () => {
        expect(groupArrayBy([1, 2, 3, 4, 5], 2)).toEqual([
            [1, 2],
            [3, 4],
            [5],
        ]);
    });

    it("returns an empty array when given an empty array", () => {
        expect(groupArrayBy([], 2)).toEqual([]);
    });
});

describe("getPostsTotalPages", () => {
    it("returns 0 when there are no posts", () => {
        mockGetAllContentFor.mockReturnValue([]);

        expect(getPostsTotalPages()).toBe(0);
    });

    it("returns 1 when there is between 1 and 7 posts", () => {
        mockGetAllContentFor.mockReturnValue(
            Array.from({ length: 7 }, (_, i) => makePost(`post-${i}`, [], `2024-01-0${i + 1}`)),
        );

        expect(getPostsTotalPages()).toBe(1);
    });

    it("returns 2 when there are 8 posts (just over one page)", () => {
        mockGetAllContentFor.mockReturnValue(
            Array.from({ length: 8 }, (_, i) => makePost(`post-${i}`, [], `2024-01-0${i + 1}`)),
        );

        expect(getPostsTotalPages()).toBe(2);
    });

    it("returns 2 when there are exactly 14 posts (two full pages)", () => {
        mockGetAllContentFor.mockReturnValue(
            Array.from({ length: 14 }, (_, i) =>
                makePost(`post-${i}`, [], `2024-01-${String(i + 1).padStart(2, "0")}`),
            ),
        );

        expect(getPostsTotalPages()).toBe(2);
    });

    it("returns 3 when there are 15 posts (just over two pages)", () => {
        mockGetAllContentFor.mockReturnValue(
            Array.from({ length: 15 }, (_, i) =>
                makePost(`post-${i}`, [], `2024-01-${String(i + 1).padStart(2, "0")}`),
            ),
        );

        expect(getPostsTotalPages()).toBe(3);
    });
});

describe("getPostsPaginationFor", () => {
    const posts = Array.from({ length: 15 }, (_, i) =>
        makePost(`post-${i + 1}`, [], `2024-01-${String(i + 1).padStart(2, "0")}`),
    );
    const sortedPosts = [...posts].reverse();

    beforeEach(() => {
        mockGetAllContentFor.mockReturnValue(posts);
    });

    it("returns the first page with the most recent post as launchPost and no previousPageUrl", () => {
        const result = getPostsPaginationFor(1);

        expect(result?.launchPost.slug.formatted).toBe("post-15");
        expect(result?.postsGrouped).toEqual([
            [sortedPosts[1], sortedPosts[2]],
            [sortedPosts[3], sortedPosts[4]],
            [sortedPosts[5], sortedPosts[6]],
        ]);
        expect(result?.previousPageUrl).toBeUndefined();
        expect(result?.nextPageUrl).toBe("/blog/posts/2");
    });

    it("returns a middle page with the blog home as previousPageUrl", () => {
        const result = getPostsPaginationFor(2);

        expect(result?.launchPost.slug.formatted).toBe("post-8");
        expect(result?.previousPageUrl).toBe("/blog");
        expect(result?.nextPageUrl).toBe("/blog/posts/3");
    });

    it("returns the last page with no nextPageUrl and a numbered previousPageUrl", () => {
        const result = getPostsPaginationFor(3);

        expect(result?.launchPost.slug.formatted).toBe("post-1");
        expect(result?.postsGrouped).toEqual([]);
        expect(result?.previousPageUrl).toBe("/blog/posts/2");
        expect(result?.nextPageUrl).toBeUndefined();
    });

    it("exposes the actual totalPages runtime field alongside the typed Pagination shape", () => {
        const result = getPostsPaginationFor(1) as unknown as { totalPages: number };

        expect(result.totalPages).toBe(3);
    });

    it("returns undefined when the requested page is out of range", () => {
        expect(getPostsPaginationFor(4)).toBeUndefined();
    });

    it("returns undefined when computing the pagination throws", () => {
        mockGetAllContentFor.mockImplementation(() => {
            throw new Error("content not found");
        });

        expect(getPostsPaginationFor(1)).toBeUndefined();
    });
});

describe("getTags", () => {
    it("returns an empty array when there are no posts", () => {
        mockGetAllContentFor.mockReturnValue([]);

        expect(getTags()).toEqual([]);
    });

    it("returns a single tag with count 1 and a slash-wrapped slug", () => {
        mockGetAllContentFor.mockReturnValue([makePost("post-a", ["react"], "2024-01-01")]);

        const result = getTags();

        expect(result).toEqual([
            {
                tagValue: "react",
                count: 1,
                tagSlugText: "react",
                slug: "/blog/tag/react/",
            },
        ]);
    });

    it("increments the count when the same tag appears on multiple posts", () => {
        mockGetAllContentFor.mockReturnValue([
            makePost("post-a", ["react"], "2024-01-01"),
            makePost("post-b", ["react"], "2024-02-01"),
        ]);

        const result = getTags();

        expect(result).toHaveLength(1);
        expect(result[0].count).toBe(2);
    });

    it("sorts tags alphabetically case-insensitively", () => {
        mockGetAllContentFor.mockReturnValue([
            makePost("post-a", ["vue"], "2024-01-01"),
            makePost("post-b", ["React"], "2024-02-01"),
        ]);

        const result = getTags();

        expect(result.map((tag) => tag.tagValue)).toEqual(["React", "vue"]);
    });

    it("replaces spaces with hyphens in the tagSlugText", () => {
        mockGetAllContentFor.mockReturnValue([makePost("post-a", ["machine learning"], "2024-01-01")]);

        const result = getTags();

        expect(result[0].tagSlugText).toBe("machine-learning");
        expect(result[0].slug).toBe("/blog/tag/machine-learning/");
    });
});

describe("getPostsForTag", () => {
    it("returns posts that include the given tag among several tags", () => {
        mockGetAllContentFor.mockReturnValue([
            makePost("post-a", ["react", "typescript"], "2024-01-01"),
            makePost("post-b", ["vue"], "2024-02-01"),
            makePost("post-c", ["react"], "2024-03-01"),
        ]);

        const result = getPostsForTag("react");

        expect(result.map((post) => post.slug.formatted)).toEqual(["post-c", "post-a"]);
    });

    it("returns an empty array when no post has the given tag", () => {
        mockGetAllContentFor.mockReturnValue([makePost("post-a", ["vue"], "2024-01-01")]);

        expect(getPostsForTag("react")).toEqual([]);
    });

    it("is case-sensitive when matching the tag", () => {
        mockGetAllContentFor.mockReturnValue([makePost("post-a", ["React"], "2024-01-01")]);

        expect(getPostsForTag("react")).toEqual([]);
    });
});

describe("getAuthorsWithPosts", () => {
    it("delegates to aggregateAuthorsWithPosts using the full post list", () => {
        const fabrizio = makeAuthor("fabrizio_duroni", "Fabrizio Duroni");
        const posts = [
            makePost("post-a", [], "2024-01-01", [fabrizio]),
            makePost("post-b", [], "2024-02-01", [fabrizio]),
        ];
        mockGetAllContentFor.mockReturnValue(posts);

        const result = getAuthorsWithPosts();

        expect(result).toEqual(aggregateAuthorsWithPosts(posts));
    });
});

describe("getAuthorWithPostsBySlug", () => {
    it("resolves the author and their posts from all content when found", () => {
        const fabrizio = makeAuthor("fabrizio_duroni", "Fabrizio Duroni");
        const posts = [makePost("post-a", [], "2024-01-01", [fabrizio])];
        mockGetAllContentFor.mockReturnValue(posts);

        const result = getAuthorWithPostsBySlug("fabrizio-duroni");

        expect(result?.author.id).toBe("fabrizio_duroni");
        expect(result?.posts).toHaveLength(1);
    });

    it("returns undefined when no post matches the author slug", () => {
        const francesco = makeAuthor("francesco_bonfadelli", "Francesco Bonfadelli");
        mockGetAllContentFor.mockReturnValue([makePost("post-a", [], "2024-01-01", [francesco])]);

        expect(getAuthorWithPostsBySlug("fabrizio-duroni")).toBeUndefined();
    });

    it("returns undefined when there is no content at all", () => {
        mockGetAllContentFor.mockReturnValue([]);

        expect(getAuthorWithPostsBySlug("fabrizio-duroni")).toBeUndefined();
    });
});

describe("getReadNextPosts", () => {
    it("excludes the current post and ranks remaining candidates by shared tags when found", () => {
        mockGetAllContentFor.mockReturnValue([
            makePost("post-target", ["react"], "2024-01-15"),
            makePost("post-related", ["react"], "2024-01-10"),
            makePost("post-unrelated", ["vue"], "2024-01-05"),
        ]);

        const result = getReadNextPosts("post-target", 2);

        expect(result.map((post) => post.slug.formatted)).toEqual(["post-related", "post-unrelated"]);
    });

    it("falls back to the most recent posts when the current slug is not found", () => {
        mockGetAllContentFor.mockReturnValue([
            makePost("post-target", ["react"], "2024-01-15"),
            makePost("post-related", ["react"], "2024-01-10"),
            makePost("post-unrelated", ["vue"], "2024-01-05"),
        ]);

        const result = getReadNextPosts("does-not-exist", 2);

        expect(result.map((post) => post.slug.formatted)).toEqual(["post-target", "post-related"]);
    });

    it("returns an empty array when the current post is the only one available", () => {
        mockGetAllContentFor.mockReturnValue([makePost("post-target", ["react"], "2024-01-15")]);

        expect(getReadNextPosts("post-target", 2)).toEqual([]);
    });

    it("returns an empty array when limit is 0", () => {
        mockGetAllContentFor.mockReturnValue([
            makePost("post-target", ["react"], "2024-01-15"),
            makePost("post-related", ["react"], "2024-01-10"),
        ]);

        expect(getReadNextPosts("post-target", 0)).toEqual([]);
    });

    it("returns fewer than limit when there are not enough candidates", () => {
        mockGetAllContentFor.mockReturnValue([
            makePost("post-target", ["react"], "2024-01-15"),
            makePost("post-related", ["react"], "2024-01-10"),
        ]);

        const result = getReadNextPosts("post-target", 5);

        expect(result).toHaveLength(1);
    });

    it("uses the default limit of 2 when no limit is provided", () => {
        mockGetAllContentFor.mockReturnValue([
            makePost("post-target", ["react"], "2024-01-15"),
            makePost("post-related-1", ["react"], "2024-01-10"),
            makePost("post-related-2", ["react"], "2024-01-09"),
            makePost("post-related-3", ["react"], "2024-01-08"),
        ]);

        expect(getReadNextPosts("post-target")).toHaveLength(2);
    });
});
