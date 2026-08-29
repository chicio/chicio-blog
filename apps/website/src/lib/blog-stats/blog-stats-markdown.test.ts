import { describe, it, expect, vi } from "vitest";

const { mockGetBlogStats } = vi.hoisted(() => ({ mockGetBlogStats: vi.fn() }));

vi.mock("@/lib/blog-stats/blog-stats", () => ({ getBlogStats: mockGetBlogStats }));

import { blogStatsMarkdown } from "./blog-stats-markdown";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

describe("blogStatsMarkdown", () => {
    it("renders the canonical header with headline/year/tag/author sections", () => {
        mockGetBlogStats.mockReturnValue({
            headline: { totalPosts: 42, totalWords: 1000, totalReadingMinutes: 30, yearsActive: 6, authorCount: 3, tagCount: 15 },
            postsPerYear: [{ year: 2024, count: 5 }],
            tagDistribution: [{ tag: "react", count: 8 }],
            externalAuthorDistribution: [{ author: "Jane Doe", count: 2 }],
        });

        const result = blogStatsMarkdown();

        expect(result).toContain(`# Blog Stats — ${siteMetadata.title}`);
        expect(result).toContain(`**URL:** ${siteMetadata.siteUrl}${slugs.blog.stats}`);
        expect(result).toContain("## Headline numbers");
        expect(result).toContain("- Posts: 42");
        expect(result).toContain("## Posts per year");
        expect(result).toContain("- 2024: 5 posts");
        expect(result).toContain("## Top tags");
        expect(result).toContain("- react: 8 posts");
        expect(result).toContain("## Posts per external authors");
        expect(result).toContain("- Jane Doe: 2 posts");
    });
});
