import { describe, it, expect } from "vitest";
import { rankReadNextPosts } from "./posts";
import { Content } from "@/types/content/content";

const makePost = (slug: string, tags: string[], dateFormatted: string): Content =>
    ({
        slug: { formatted: slug, params: {} },
        frontmatter: {
            title: slug,
            description: "",
            tags,
            authors: [],
            date: { formatted: dateFormatted, year: 2024, month: 1, day: 1 },
            image: "",
        },
        readingTime: { text: "", minutes: 0, time: 0, words: 0 },
        contentFileRelativePath: "",
        content: "",
    }) as Content;

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
