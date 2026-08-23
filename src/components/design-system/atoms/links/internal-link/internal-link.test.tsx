import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InternalLink } from "./internal-link";

vi.mock("next/link", () => ({
    default: ({
        href,
        children,
        className,
        onClick,
        onMouseEnter,
        onFocus,
        prefetch,
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean | null }) => (
        <a
            href={href}
            className={className}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onFocus={onFocus}
            data-prefetch={prefetch === undefined ? "undefined" : String(prefetch)}
        >
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

    describe("prefetch", () => {
        it("passes no prefetch override by default (viewport strategy)", () => {
            render(<InternalLink to="/blog">Blog</InternalLink>);
            expect(screen.getByRole("link")).toHaveAttribute("data-prefetch", "undefined");
        });

        it("passes no prefetch override when explicitly set to viewport", () => {
            render(
                <InternalLink to="/blog" prefetch="viewport">
                    Blog
                </InternalLink>,
            );
            expect(screen.getByRole("link")).toHaveAttribute("data-prefetch", "undefined");
        });

        it("disables prefetch when set to never", () => {
            render(
                <InternalLink to="/blog" prefetch="never">
                    Blog
                </InternalLink>,
            );
            expect(screen.getByRole("link")).toHaveAttribute("data-prefetch", "false");
        });

        it("disables prefetch until hovered when set to hover", async () => {
            render(
                <InternalLink to="/blog" prefetch="hover">
                    Blog
                </InternalLink>,
            );
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("data-prefetch", "false");

            await userEvent.hover(link);
            expect(link).toHaveAttribute("data-prefetch", "null");
        });

        it("disables prefetch until focused when set to hover", async () => {
            render(
                <InternalLink to="/blog" prefetch="hover">
                    Blog
                </InternalLink>,
            );
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("data-prefetch", "false");

            await userEvent.tab();
            expect(link).toHaveFocus();
            expect(link).toHaveAttribute("data-prefetch", "null");
        });

        it("stays prefetchable when intent is shown again after the first time", async () => {
            render(
                <InternalLink to="/blog" prefetch="hover">
                    Blog
                </InternalLink>,
            );
            const link = screen.getByRole("link");

            await userEvent.hover(link);
            expect(link).toHaveAttribute("data-prefetch", "null");

            await userEvent.tab();
            expect(link).toHaveFocus();
            expect(link).toHaveAttribute("data-prefetch", "null");
        });
    });
});
