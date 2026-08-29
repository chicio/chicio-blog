import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import type { LinkComponent } from "@/components/design-system/atoms/links/anchor-link";
import { MenuItem } from "./menu-item";

describe("MenuItem", () => {
    describe("render", () => {
        it("renders children text", () => {
            render(<MenuItem to="/blog" selected={false}>Blog</MenuItem>);
            expect(screen.getByText("Blog")).toBeInTheDocument();
        });

        it("renders as an internal link when external is false", () => {
            render(<MenuItem to="/blog" selected={false}>Blog</MenuItem>);
            expect(screen.getByRole("link")).toHaveAttribute("href", "/blog");
        });

        it("renders as an anchor tag when external is true", () => {
            render(
                <MenuItem to="https://example.com" selected={false} external={true}>
                    External
                </MenuItem>,
            );
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("href", "https://example.com");
            expect(link).toHaveAttribute("target", "_blank");
        });
    });

    describe("props", () => {
        it("applies accent class when selected is true", () => {
            render(<MenuItem to="/blog" selected={true}>Blog</MenuItem>);
            expect(screen.getByRole("link")).toHaveClass("text-accent");
        });

        it("applies primary-text class when selected is false", () => {
            render(<MenuItem to="/blog" selected={false}>Blog</MenuItem>);
            expect(screen.getByRole("link")).toHaveClass("text-primary-text");
        });
    });

    describe("interaction", () => {
        it("calls onClick when clicked", async () => {
            const onClick = vi.fn();
            render(
                <MenuItem to="/blog" selected={false} onClick={onClick}>
                    Blog
                </MenuItem>,
            );
            await userEvent.click(screen.getByRole("link"));
            expect(onClick).toHaveBeenCalledOnce();
        });
    });

    describe("link component injection", () => {
        it("renders a plain anchor when no link component is injected", () => {
            render(
                <MenuItem to="/blog" selected={false}>
                    Blog
                </MenuItem>,
            );
            expect(screen.getByRole("link")).toHaveAttribute("href", "/blog");
        });

        it("renders internal links through the injected link component", () => {
            const spyLink: LinkComponent = ({ href, children }) => (
                <a href={href} data-injected="true">
                    {children}
                </a>
            );
            render(
                <MenuItem to="/blog" selected={false} linkComponent={spyLink}>
                    Blog
                </MenuItem>,
            );
            expect(screen.getByRole("link")).toHaveAttribute("data-injected", "true");
        });

        it("keeps external links as plain anchors, bypassing the injected component", () => {
            const spyLink: LinkComponent = ({ href, children }) => (
                <a href={href} data-injected="true">
                    {children}
                </a>
            );
            render(
                <MenuItem to="https://example.com" selected={false} external linkComponent={spyLink}>
                    Away
                </MenuItem>,
            );
            expect(screen.getByRole("link")).not.toHaveAttribute("data-injected");
        });
    });
});
