import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InternalLink } from "./internal-link";

vi.mock("next/link", () => ({
    default: ({ href, children, className, onClick, prefetch: _prefetch }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean }) => (
        <a href={href} className={className} onClick={onClick}>
            {children}
        </a>
    ),
}));

describe("InternalLink", () => {
    describe("render", () => {
        it("renders an anchor with the provided href", () => {
            render(<InternalLink to="/about">About</InternalLink>);
            expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
        });

        it("applies className when provided", () => {
            render(
                <InternalLink to="/about" className="nav-link">
                    About
                </InternalLink>,
            );
            expect(screen.getByRole("link")).toHaveClass("nav-link");
        });

        it("renders children", () => {
            render(<InternalLink to="/blog">Read the blog</InternalLink>);
            expect(screen.getByText("Read the blog")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onClick when the link is clicked", async () => {
            const onClick = vi.fn();
            render(
                <InternalLink to="/blog" onClick={onClick}>
                    Blog
                </InternalLink>,
            );
            await userEvent.click(screen.getByRole("link"));
            expect(onClick).toHaveBeenCalledOnce();
        });
    });
});
