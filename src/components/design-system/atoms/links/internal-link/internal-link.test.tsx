import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { LinkComponent } from "@/components/design-system/atoms/links/anchor-link";
import { InternalLink } from "./internal-link";

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

    describe("link component injection", () => {
        const spyLink: LinkComponent = ({ href, prefetch, children }) => (
            <a href={href} data-prefetch={prefetch}>
                {children}
            </a>
        );

        it("renders a plain anchor when no link component is injected", () => {
            render(<InternalLink to="/blog">Blog</InternalLink>);
            const link = screen.getByRole("link");
            expect(link.tagName).toBe("A");
            expect(link).toHaveAttribute("href", "/blog");
            expect(link).not.toHaveAttribute("prefetch");
        });

        it("renders through the injected link component", () => {
            render(
                <InternalLink to="/blog" linkComponent={spyLink}>
                    Blog
                </InternalLink>,
            );
            expect(screen.getByRole("link")).toHaveAttribute("href", "/blog");
        });

        it("forwards the viewport prefetch strategy by default", () => {
            render(
                <InternalLink to="/blog" linkComponent={spyLink}>
                    Blog
                </InternalLink>,
            );
            expect(screen.getByRole("link")).toHaveAttribute("data-prefetch", "viewport");
        });

        it("forwards an explicit prefetch strategy", () => {
            render(
                <InternalLink to="/blog" prefetch="hover" linkComponent={spyLink}>
                    Blog
                </InternalLink>,
            );
            expect(screen.getByRole("link")).toHaveAttribute("data-prefetch", "hover");
        });
    });
});
