import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PreviousNextNavigation } from "./previous-next-navigation";

vi.mock("next/link", () => ({
    default: ({ href, children }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} data-next-link="true">
            {children}
        </a>
    ),
}));

describe("PreviousNextNavigation binding", () => {
    it("renders both pills through next/link", () => {
        render(
            <PreviousNextNavigation
                previous={{ url: "/manga/death-note", title: "Death Note" }}
                next={{ url: "/manga/one-piece", title: "One Piece" }}
            />,
        );
        const links = screen.getAllByRole("link");
        expect(links.map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
            ["Death Note", "/manga/death-note"],
            ["One Piece", "/manga/one-piece"],
        ]);
        links.forEach((link) => expect(link).toHaveAttribute("data-next-link", "true"));
    });

    it("renders only the side that has a sibling", () => {
        render(<PreviousNextNavigation next={{ url: "/manga/one-piece", title: "One Piece" }} />);
        expect(screen.getAllByRole("link")).toHaveLength(1);
    });
});
