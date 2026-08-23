import { describe, it, expect, vi } from "vitest";
import { render, screen, nextLinkMock } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { BlogGenericPostListPageTemplate } from "./index";
import type { Content } from "@/types/content/content";
import type { Author } from "@/types/content/author";

vi.mock("next/link", () => nextLinkMock());

vi.mock("@/components/features/content/content-page", () => ({
    ContentPage: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

const author: Author = {
    id: "fabrizio_duroni",
    name: "Fabrizio Duroni",
    linkedinUrl: "https://fabrizioduroni.it",
    image: "/media/authors/fabrizio.jpg",
    imageLarge: "/media/authors/fabrizio-large.jpg",
};

const buildPost = (title: string, slug: string): Content => ({
    frontmatter: {
        title,
        description: "A test post",
        tags: [],
        authors: [author],
        date: { year: 2026, month: 6, day: 28, formatted: "28/06/2026" },
        image: "/media/posts/test.jpg",
    },
    slug: { params: {}, formatted: slug },
    readingTime: { text: "5 min read", minutes: 5, time: 300000, words: 1000 },
    contentFileRelativePath: `${slug}.mdx`,
    content: "",
});

const posts = [buildPost("First post", "/blog/first-post"), buildPost("Second post", "/blog/second-post")];

describe("BlogGenericPostListPageTemplate", () => {
    describe("render", () => {
        it("renders a link for every post pointing at its slug", () => {
            render(
                <BlogGenericPostListPageTemplate
                    title="Archive"
                    posts={posts}
                    author="Fabrizio Duroni"
                    trackingCategory="blog_archive"
                />,
            );
            expect(screen.getByRole("link", { name: "First post" })).toHaveAttribute("href", "/blog/first-post");
            expect(screen.getByRole("link", { name: "Second post" })).toHaveAttribute("href", "/blog/second-post");
        });
    });

    describe("prefetch", () => {
        it("passes no prefetch override by default (viewport strategy)", () => {
            render(
                <BlogGenericPostListPageTemplate
                    title="Archive"
                    posts={posts}
                    author="Fabrizio Duroni"
                    trackingCategory="blog_archive"
                />,
            );
            expect(screen.getByRole("link", { name: "First post" })).toHaveAttribute("data-prefetch", "undefined");
        });

        it("forwards an explicit hover strategy to every post link, prefetching only once hovered", async () => {
            render(
                <BlogGenericPostListPageTemplate
                    title="Archive"
                    posts={posts}
                    author="Fabrizio Duroni"
                    trackingCategory="blog_archive"
                    prefetch="hover"
                />,
            );
            const firstLink = screen.getByRole("link", { name: "First post" });
            const secondLink = screen.getByRole("link", { name: "Second post" });
            expect(firstLink).toHaveAttribute("data-prefetch", "false");
            expect(secondLink).toHaveAttribute("data-prefetch", "false");

            await userEvent.hover(firstLink);
            expect(firstLink).toHaveAttribute("data-prefetch", "null");
            expect(secondLink).toHaveAttribute("data-prefetch", "false");
        });
    });
});
