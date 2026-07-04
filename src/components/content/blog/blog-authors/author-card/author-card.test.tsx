import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, nextImageMock, nextLinkMock } from "@/test-utils";
import { AuthorCard } from "./index";
import type { Author } from "@/types/content/author";

vi.mock("next/image", () => nextImageMock());
vi.mock("next/link", () => nextLinkMock());

vi.mock("@/components/design-system/hooks/use-in-view-list", () => ({
    useInViewList: () => [vi.fn(), true],
}));

const trackWith = vi.fn();
vi.mock("@/lib/tracking/tracking", () => ({ trackWith: (...args: unknown[]) => trackWith(...args) }));

const author: Author = {
    id: "fabrizio_duroni",
    name: "Fabrizio Duroni",
    linkedinUrl: "https://www.linkedin.com/in/fabrizio-duroni/",
    image: "/media/authors/fabrizio-duroni-small.jpg",
};

describe("AuthorCard", () => {
    describe("render", () => {
        it("renders the author name", () => {
            render(<AuthorCard author={author} postCount={3} />);
            expect(screen.getByText("Fabrizio Duroni")).toBeInTheDocument();
        });

        it("renders the author avatar", () => {
            render(<AuthorCard author={author} postCount={3} />);
            expect(screen.getByAltText("Fabrizio Duroni")).toBeInTheDocument();
        });

        it("renders the post count, pluralized", () => {
            render(<AuthorCard author={author} postCount={3} />);
            expect(screen.getByText("3 posts")).toBeInTheDocument();
        });

        it("uses the singular form when there is exactly one post", () => {
            render(<AuthorCard author={author} postCount={1} />);
            expect(screen.getByText("1 post")).toBeInTheDocument();
        });

        it("renders the role when present", () => {
            render(
                <AuthorCard
                    author={{ ...author, role: "Software Engineer" }}
                    postCount={1}
                />,
            );
            expect(screen.getByText("Software Engineer")).toBeInTheDocument();
        });

        it("does not render a role when absent", () => {
            render(<AuthorCard author={author} postCount={1} />);
            expect(screen.queryByText("Software Engineer")).not.toBeInTheDocument();
        });

        it("links the site owner's card to the about-me page", () => {
            render(<AuthorCard author={author} postCount={1} />);
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("href", "/about-me");
        });

        it("links a non-owner card to their author detail page", () => {
            render(
                <AuthorCard
                    author={{ ...author, id: "marco_de_lucchi", name: "Marco De Lucchi" }}
                    postCount={1}
                />,
            );
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("href", "/blog/author/marco-de-lucchi");
        });
    });

    describe("interaction", () => {
        it("tracks author navigation when the card is clicked", async () => {
            render(<AuthorCard author={author} postCount={1} />);
            await userEvent.click(screen.getByRole("link"));
            expect(trackWith).toHaveBeenCalledOnce();
        });
    });
});
