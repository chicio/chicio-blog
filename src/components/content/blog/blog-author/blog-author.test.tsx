import { describe, it, expect, vi } from "vitest";
import { render, screen, nextImageMock } from "@/test-utils";
import type { ReactNode } from "react";
import { BlogAuthor } from "./index";
import type { Author } from "@/types/content/author";
import type { Content } from "@/types/content/content";

vi.mock("next/image", () => nextImageMock());

vi.mock("@/components/content/blog/blog-generic-post-list-page-template", () => ({
    BlogGenericPostListPageTemplate: ({ title, beforeContent }: { title: string; beforeContent?: ReactNode }) => (
        <div>
            {beforeContent}
            <h1>{title}</h1>
        </div>
    ),
}));

const makePost = (slug: string): Content =>
    ({
        slug: { formatted: slug, params: {} },
        frontmatter: {
            title: slug,
            description: "",
            tags: [],
            authors: [],
            date: { formatted: "2024-01-01", year: 2024, month: 1, day: 1 },
            image: "",
        },
        readingTime: { text: "", minutes: 0, time: 0, words: 0 },
        contentFileRelativePath: "",
        content: "",
    }) as Content;

const baseAuthor: Author = {
    id: "fabrizio_duroni",
    name: "Fabrizio Duroni",
    url: "https://www.linkedin.com/in/fabrizio-duroni/",
    image: "/media/authors/fabrizio-duroni-small.jpg",
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

        it("renders an external LinkedIn link to author.url", () => {
            render(<BlogAuthor author={baseAuthor} posts={[makePost("post-a")]} />);
            const link = screen.getByRole("link", { name: /LinkedIn/i });
            expect(link).toHaveAttribute("href", baseAuthor.url);
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noopener noreferrer");
        });

        it("passes a posts-published-count heading to the reused post list template", () => {
            render(<BlogAuthor author={baseAuthor} posts={[makePost("post-a"), makePost("post-b")]} />);
            expect(screen.getByText("Posts published (2)")).toBeInTheDocument();
        });
    });
});
