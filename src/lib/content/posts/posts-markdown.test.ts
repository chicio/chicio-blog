import { describe, it, expect, vi } from "vitest";

const { mockListPosts, mockSinglePost, mockGetTags } = vi.hoisted(() => ({
    mockListPosts: vi.fn(),
    mockSinglePost: vi.fn(),
    mockGetTags: vi.fn(),
}));

vi.mock("@/lib/content/posts/posts", () => ({
    posts: { list: mockListPosts, single: mockSinglePost },
    getTags: mockGetTags,
}));

import { blogListingMarkdown, blogPostMarkdown, homepageMarkdown } from "./posts-markdown";
import { siteMetadata } from "@/types/configuration/site-metadata";

const post = {
    frontmatter: {
        title: "Hello World",
        description: "A first post",
        date: { formatted: "01 Jan 2024" },
        tags: ["react", "testing"],
        authors: [{ name: "Fabrizio Duroni" }],
    },
    slug: { formatted: "/blog/post/2024/01/01/hello-world" },
    content: "Some **body** content.",
};

describe("posts-markdown", () => {
    describe("homepageMarkdown", () => {
        it("renders the canonical header for the homepage", () => {
            mockListPosts.mockReturnValue([post]);

            const result = homepageMarkdown();

            expect(result).toContain(`# ${siteMetadata.title}`);
            expect(result).toContain(`> ${siteMetadata.description}`);
            expect(result).toContain(`**URL:** ${siteMetadata.siteUrl}/`);
            expect(result).toContain("## Latest Posts");
            expect(result).toContain("[Hello World]");
        });
    });

    describe("blogListingMarkdown", () => {
        it("renders the canonical header for the blog listing", () => {
            mockListPosts.mockReturnValue([post]);
            mockGetTags.mockReturnValue([{ tagValue: "react", tagSlugText: "react", count: 1 }]);

            const result = blogListingMarkdown();

            expect(result).toContain(`# Blog — ${siteMetadata.title}`);
            expect(result).toContain(`**URL:** ${siteMetadata.siteUrl}/blog`);
            expect(result).toContain("## All Posts");
            expect(result).toContain("## Tags");
        });
    });

    describe("blogPostMarkdown", () => {
        it("returns null when the post does not exist", () => {
            mockSinglePost.mockReturnValue(undefined);

            expect(blogPostMarkdown({ slug: "missing" })).toBeNull();
        });

        it("folds author/date/tags into the body, after the canonical header", () => {
            mockSinglePost.mockReturnValue(post);

            const result = blogPostMarkdown({ slug: "hello-world" });

            expect(result).toContain("# Hello World");
            expect(result).toContain("> A first post");
            expect(result).toContain(`**URL:** ${siteMetadata.siteUrl}/blog/post/2024/01/01/hello-world`);
            expect(result).toContain("---");
            expect(result).toContain("**Author:** Fabrizio Duroni");
            expect(result).toContain("**Date:** 01 Jan 2024");
            expect(result).toContain("**Tags:** react, testing");
            expect(result).toContain("Some **body** content.");
        });
    });
});
