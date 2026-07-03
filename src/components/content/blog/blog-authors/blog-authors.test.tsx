import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, nextImageMock, nextLinkMock } from "@/test-utils";
import type { ReactNode } from "react";
import { BlogAuthors } from "./index";
import type { AuthorSummary } from "@/types/content/author";

vi.mock("next/image", () => nextImageMock());
vi.mock("next/link", () => nextLinkMock());
vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

vi.mock("@/components/features/content/content-page", () => ({
    ContentPage: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

const fabrizio: AuthorSummary = {
    author: {
        id: "fabrizio_duroni",
        name: "Fabrizio Duroni",
        url: "https://www.linkedin.com/in/fabrizio-duroni/",
        image: "/media/authors/fabrizio-duroni-small.jpg",
    },
    postCount: 5,
    slug: "/blog/author/fabrizio-duroni",
};

const francesco: AuthorSummary = {
    author: {
        id: "francesco_bonfadelli",
        name: "Francesco Bonfadelli",
        url: "https://www.linkedin.com/in/fbonfadelli/",
        image: "/media/authors/francesco-bonfadelli.jpg",
    },
    postCount: 2,
    slug: "/blog/author/francesco-bonfadelli",
};

const authors = [fabrizio, francesco];

describe("BlogAuthors", () => {
    describe("render", () => {
        it("renders a card for every author", () => {
            render(<BlogAuthors author="Fabrizio Duroni" authors={authors} />);
            expect(screen.getByText("Fabrizio Duroni")).toBeInTheDocument();
            expect(screen.getByText("Francesco Bonfadelli")).toBeInTheDocument();
        });

        it("renders the filter input", () => {
            render(<BlogAuthors author="Fabrizio Duroni" authors={authors} />);
            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });
    });

    describe("filtering", () => {
        it("narrows the visible authors as the user types", async () => {
            render(<BlogAuthors author="Fabrizio Duroni" authors={authors} />);
            await userEvent.type(screen.getByRole("textbox"), "francesco");
            expect(screen.getByText("Francesco Bonfadelli")).toBeInTheDocument();
            expect(screen.queryByText("Fabrizio Duroni")).not.toBeInTheDocument();
        });

        it("shows an empty-state message when no author matches", async () => {
            render(<BlogAuthors author="Fabrizio Duroni" authors={authors} />);
            await userEvent.type(screen.getByRole("textbox"), "nonexistent");
            expect(screen.getByText(/No authors found for/)).toBeInTheDocument();
        });
    });
});
