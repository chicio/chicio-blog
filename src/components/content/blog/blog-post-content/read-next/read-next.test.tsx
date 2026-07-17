import { describe, it, expect, vi } from "vitest";
import { render, screen, nextLinkMock } from "@/test-utils";
import { RecentPosts } from "./index";
import type { Content } from "@/types/content/content";

vi.mock("next/link", () => nextLinkMock());

const { getReadNextPostsMock } = vi.hoisted(() => ({
    getReadNextPostsMock: vi.fn(),
}));

vi.mock("@/lib/content/posts/posts", () => ({
    getReadNextPosts: getReadNextPostsMock,
}));

const makePost = (slug: string, title: string, description: string): Content =>
    ({
        slug: { params: { slug }, formatted: `/blog/post/2026/01/01/${slug}` },
        frontmatter: { title, description, tags: [], authors: [], date: { year: 2026, month: 1, day: 1, formatted: "2026-01-01" }, image: "/media/posts/test.jpg" },
        readingTime: { text: "5 min read", minutes: 5, time: 300000, words: 100 },
        contentFileRelativePath: `blog/post/2026/01/01/${slug}/content.mdx`,
        content: "",
    }) as Content;

describe("RecentPosts", () => {
    describe("render", () => {
        it("renders the Read next heading", () => {
            getReadNextPostsMock.mockReturnValue([makePost("post-one", "Post One", "Description one")]);
            render(<RecentPosts currentSlug="/blog/post/current" />);
            expect(screen.getByRole("heading", { name: "Read next", level: 2 })).toBeInTheDocument();
        });

        it("renders a terminal list item with title and description for each post", () => {
            getReadNextPostsMock.mockReturnValue([
                makePost("post-one", "Post One", "Description one"),
                makePost("post-two", "Post Two", "Description two"),
            ]);
            render(<RecentPosts currentSlug="/blog/post/current" />);
            expect(screen.getByText(/>\s*Post One/)).toBeInTheDocument();
            expect(screen.getByText("Description one")).toBeInTheDocument();
            expect(screen.getByText(/>\s*Post Two/)).toBeInTheDocument();
            expect(screen.getByText("Description two")).toBeInTheDocument();
        });

        it("links each item to the post slug", () => {
            getReadNextPostsMock.mockReturnValue([makePost("post-one", "Post One", "Description one")]);
            render(<RecentPosts currentSlug="/blog/post/current" />);
            const link = screen.getByRole("link", { name: /Post One/ });
            expect(link).toHaveAttribute("href", "/blog/post/2026/01/01/post-one");
        });

        it("renders no image or post metadata for a read-next entry", () => {
            getReadNextPostsMock.mockReturnValue([makePost("post-one", "Post One", "Description one")]);
            render(<RecentPosts currentSlug="/blog/post/current" />);
            expect(screen.queryByRole("img")).not.toBeInTheDocument();
        });
    });
});
