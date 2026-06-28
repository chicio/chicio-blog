import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils";
import { PostCard } from "./index";
import type { Author } from "@/types/content/author";

vi.mock("next/image", () => ({
    default: ({
        alt,
        src,
        ...rest
    }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) => (
        <img alt={alt} src={src} {...rest} />
    ),
}));

vi.mock("next/link", () => ({
    default: ({
        href,
        children,
        ...rest
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} {...rest}>
            {children}
        </a>
    ),
}));

const author: Author = {
    name: "Fabrizio Duroni",
    url: "https://fabrizioduroni.it",
    image: "/media/authors/fabrizio.jpg",
};

const defaultProps = {
    big: false,
    slug: "/blog/test-post",
    title: "Test Post Title",
    image: "/media/posts/test.jpg",
    authors: [author],
    tags: ["typescript", "testing"],
    date: "2026-06-28",
    readingTime: "5 min read",
    description: "A test post about testing",
};

describe("PostCard", () => {
    describe("render", () => {
        it("renders the post title", () => {
            render(<PostCard {...defaultProps} />);
            expect(screen.getAllByText("Test Post Title").length).toBeGreaterThan(0);
        });

        it("renders the author name", () => {
            render(<PostCard {...defaultProps} />);
            expect(screen.getByText("Fabrizio Duroni")).toBeInTheDocument();
        });

        it("renders links pointing to the post slug", () => {
            render(<PostCard {...defaultProps} />);
            const links = screen.getAllByRole("link");
            const slugLinks = links.filter((l) => l.getAttribute("href") === "/blog/test-post");
            expect(slugLinks.length).toBeGreaterThan(0);
        });

        it("renders the post image with correct alt text via next/image mock", () => {
            render(<PostCard {...defaultProps} />);
            const img = screen.getByAltText("Test Post Title");
            expect(img).toBeInTheDocument();
            expect(img.tagName).toBe("IMG");
        });

        it("renders the description", () => {
            render(<PostCard {...defaultProps} />);
            expect(screen.getByText(/A test post about testing/)).toBeInTheDocument();
        });
    });

    describe("big prop", () => {
        it("renders without error when big is true", () => {
            render(<PostCard {...defaultProps} big={true} />);
            expect(screen.getAllByText("Test Post Title").length).toBeGreaterThan(0);
        });
    });
});
