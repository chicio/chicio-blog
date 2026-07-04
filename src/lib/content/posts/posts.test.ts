import { describe, it, expect } from "vitest";
import {
    aggregateAuthorsWithPosts,
    filterPostsForAuthor,
    findAuthorWithPostsBySlug,
    rankReadNextPosts,
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
