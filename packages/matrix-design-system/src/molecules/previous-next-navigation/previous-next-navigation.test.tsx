import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PreviousNextNavigation } from "./previous-next-navigation";
import type { LinkComponent } from "../../atoms/links/anchor-link";

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

        it("renders only the previous pill when there is no next", () => {
            render(<PreviousNextNavigation previous={{ url: "/a", title: "A" }} />);
            expect(screen.getAllByRole("link")).toHaveLength(1);
            expect(screen.getByRole("link", { name: "A" })).toBeInTheDocument();
        });

        it("renders only the next pill when there is no previous", () => {
            render(<PreviousNextNavigation next={{ url: "/b", title: "B" }} />);
            expect(screen.getAllByRole("link")).toHaveLength(1);
            expect(screen.getByRole("link", { name: "B" })).toBeInTheDocument();
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
