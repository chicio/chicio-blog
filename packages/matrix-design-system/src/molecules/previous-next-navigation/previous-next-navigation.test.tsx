import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PreviousNextNavigation } from "./previous-next-navigation";
import type { LinkComponent } from "../../atoms/links/anchor-link";

const pillVariants = (link: HTMLElement): string[] =>
    ["pill-blue", "pill-red"].filter((variant) => link.querySelector(`.${variant}`) !== null);

describe("PreviousNextNavigation", () => {
    describe("render", () => {
        it("renders both pills with their titles and urls", () => {
            render(
                <PreviousNextNavigation
                    previous={{ url: "/manga/death-note", title: "Death Note" }}
                    next={{ url: "/manga/one-piece", title: "One Piece" }}
                />,
            );
            expect(screen.getByRole("link", { name: "Death Note" })).toHaveAttribute("href", "/manga/death-note");
            expect(screen.getByRole("link", { name: "One Piece" })).toHaveAttribute("href", "/manga/one-piece");
        });

        it("puts the previous target in the blue pill and the next target in the red pill, previous first", () => {
            render(
                <PreviousNextNavigation
                    previous={{ url: "/manga/death-note", title: "Death Note" }}
                    next={{ url: "/manga/one-piece", title: "One Piece" }}
                />,
            );
            const previousLink = screen.getByRole("link", { name: "Death Note" });
            const nextLink = screen.getByRole("link", { name: "One Piece" });
            expect(pillVariants(previousLink)).toEqual(["pill-blue"]);
            expect(pillVariants(nextLink)).toEqual(["pill-red"]);
            expect(screen.getAllByRole("link")).toEqual([previousLink, nextLink]);
        });

        it("renders only the previous pill when there is no next", () => {
            render(<PreviousNextNavigation previous={{ url: "/a", title: "A" }} />);
            expect(screen.getAllByRole("link")).toHaveLength(1);
            expect(pillVariants(screen.getByRole("link", { name: "A" }))).toEqual(["pill-blue"]);
        });

        it("renders only the next pill when there is no previous", () => {
            render(<PreviousNextNavigation next={{ url: "/b", title: "B" }} />);
            expect(screen.getAllByRole("link")).toHaveLength(1);
            expect(pillVariants(screen.getByRole("link", { name: "B" }))).toEqual(["pill-red"]);
        });

        it("renders no links when there are no siblings", () => {
            render(<PreviousNextNavigation />);
            expect(screen.queryByRole("link")).not.toBeInTheDocument();
        });

        it("renders the links through the injected link component", () => {
            const CustomLink: LinkComponent = ({ href, children }) => (
                <a href={href} data-testid="custom-link">
                    {children}
                </a>
            );
            render(
                <PreviousNextNavigation
                    previous={{ url: "/a", title: "A" }}
                    next={{ url: "/b", title: "B" }}
                    linkComponent={CustomLink}
                />,
            );
            expect(screen.getAllByTestId("custom-link")).toHaveLength(2);
        });
    });
});
