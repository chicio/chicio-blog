import { describe, it, expect, vi } from "vitest";
import { render, screen, nextImageMock, nextLinkMock } from "@/test-utils";
import type { ReactNode } from "react";
import { BlogAuthor } from "./index";
import type { Author } from "@/types/content/author";
import type { Content } from "@/types/content/content";

vi.mock("next/image", () => nextImageMock());
vi.mock("next/link", () => nextLinkMock());

vi.mock("@/components/features/content/content-page", () => ({
    ContentPage: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

const makePost = (slug: string): Content =>
    ({
        slug: { formatted: slug, params: {} },
        frontmatter: {
            title: slug,
            description: "A description",
            tags: [],
            authors: [],
            date: { formatted: "2024-01-01", year: 2024, month: 1, day: 1 },
            image: "",
        },
        readingTime: { text: "5 min read", minutes: 5, time: 300000, words: 1000 },
        contentFileRelativePath: "",
        content: "",
    }) as Content;

const baseAuthor: Author = {
    id: "fabrizio_duroni",
    name: "Fabrizio Duroni",
    linkedinUrl: "https://www.linkedin.com/in/fabrizio-duroni/",
    image: "/media/authors/fabrizio-duroni-small.jpg",
    imageLarge: "/media/authors/fabrizio-duroni.jpg",
};

describe("BlogAuthor", () => {
    describe("render", () => {
        it("renders the author avatar", () => {
            render(<BlogAuthor author={baseAuthor} posts={[makePost("post-a")]} />);
            expect(screen.getByAltText("Fabrizio Duroni")).toBeInTheDocument();
        });

        it("renders the author name", () => {
            render(<BlogAuthor author={baseAuthor} posts={[makePost("post-a")]} />);
            expect(screen.getByText("Fabrizio Duroni")).toBeInTheDocument();
        });

        it("renders the role when present", () => {
            const author: Author = { ...baseAuthor, role: "Software Engineer" };
            render(<BlogAuthor author={author} posts={[makePost("post-a")]} />);
            expect(screen.getByText("Software Engineer")).toBeInTheDocument();
        });

        it("does not render a role when absent", () => {
            render(<BlogAuthor author={baseAuthor} posts={[makePost("post-a")]} />);
            expect(screen.queryByText("Software Engineer")).not.toBeInTheDocument();
        });

        it("renders the bio when present", () => {
            const author: Author = { ...baseAuthor, bio: "Builds things for the web." };
            render(<BlogAuthor author={author} posts={[makePost("post-a")]} />);
            expect(screen.getByText("Builds things for the web.")).toBeInTheDocument();
        });

        it("does not render a bio when absent", () => {
            render(<BlogAuthor author={baseAuthor} posts={[makePost("post-a")]} />);
            expect(screen.queryByText("Builds things for the web.")).not.toBeInTheDocument();
        });

        it("renders an external LinkedIn link to author.linkedinUrl", () => {
            render(<BlogAuthor author={baseAuthor} posts={[makePost("post-a")]} />);
            const link = screen.getByRole("link", { name: /LinkedIn/i });
            expect(link).toHaveAttribute("href", baseAuthor.linkedinUrl);
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noopener noreferrer");
        });

        it("renders a post-count chip", () => {
            render(<BlogAuthor author={baseAuthor} posts={[makePost("post-a"), makePost("post-b")]} />);
            expect(screen.getByText("2 posts published")).toBeInTheDocument();
        });

        it("renders a GitHub link when githubUrl is present", () => {
            const author: Author = { ...baseAuthor, githubUrl: "https://github.com/chicio" };
            render(<BlogAuthor author={author} posts={[makePost("post-a")]} />);
            expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute("href", "https://github.com/chicio");
        });

        it("renders a posts-published-count heading", () => {
            render(<BlogAuthor author={baseAuthor} posts={[makePost("post-a"), makePost("post-b")]} />);
            expect(screen.getByText("Posts published (2)")).toBeInTheDocument();
        });

        it("renders each of the author's posts as a PostCard", () => {
            render(<BlogAuthor author={baseAuthor} posts={[makePost("post-a"), makePost("post-b")]} />);
            expect(screen.getAllByText("post-a").length).toBeGreaterThan(0);
            expect(screen.getAllByText("post-b").length).toBeGreaterThan(0);
        });

        it("links each post card to its own slug", () => {
            render(<BlogAuthor author={baseAuthor} posts={[makePost("post-a")]} />);
            const links = screen.getAllByRole("link");
            const slugLinks = links.filter((l) => l.getAttribute("href") === "post-a");
            expect(slugLinks.length).toBeGreaterThan(0);
        });
    });
});
