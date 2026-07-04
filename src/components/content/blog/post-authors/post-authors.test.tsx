import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, nextImageMock, nextLinkMock } from "@/test-utils";
import { PostAuthors } from "./index";
import type { Author } from "@/types/content/author";

vi.mock("next/image", () => nextImageMock());
vi.mock("next/link", () => nextLinkMock());

const trackWith = vi.fn();
vi.mock("@/lib/tracking/tracking", () => ({ trackWith: (...args: unknown[]) => trackWith(...args) }));

const fabrizio: Author = {
    id: "fabrizio_duroni",
    name: "Fabrizio Duroni",
    linkedinUrl: "https://www.linkedin.com/in/fabrizio-duroni/",
    image: "/media/authors/fabrizio-duroni-small.jpg",
};

const francesco: Author = {
    id: "francesco_bonfadelli",
    name: "Francesco Bonfadelli",
    linkedinUrl: "https://www.linkedin.com/in/fbonfadelli/",
    image: "/media/authors/francesco-bonfadelli.jpg",
};

describe("PostAuthors", () => {
    describe("render", () => {
        it("renders every author's name", () => {
            render(<PostAuthors postAuthors={[fabrizio, francesco]} />);
            expect(screen.getByText("Fabrizio Duroni")).toBeInTheDocument();
            expect(screen.getByText("Francesco Bonfadelli")).toBeInTheDocument();
        });

        it("links a non-owner author name to their internal author detail page", () => {
            render(<PostAuthors postAuthors={[francesco]} />);
            const link = screen.getByRole("link", { name: "Francesco Bonfadelli" });
            expect(link).toHaveAttribute("href", "/blog/author/francesco-bonfadelli");
        });

        it("links the site owner to the about-me page", () => {
            render(<PostAuthors postAuthors={[fabrizio]} />);
            const link = screen.getByRole("link", { name: "Fabrizio Duroni" });
            expect(link).toHaveAttribute("href", "/about-me");
        });

        it("renders the author avatar", () => {
            render(<PostAuthors postAuthors={[fabrizio]} />);
            expect(screen.getByAltText("Fabrizio Duroni")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("tracks author navigation when the author link is clicked", async () => {
            render(<PostAuthors postAuthors={[fabrizio]} />);
            await userEvent.click(screen.getByRole("link", { name: "Fabrizio Duroni" }));
            expect(trackWith).toHaveBeenCalledOnce();
        });
    });
});
