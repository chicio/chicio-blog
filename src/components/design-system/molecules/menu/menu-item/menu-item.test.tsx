import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuItem } from "./menu-item";

vi.mock("next/link", () => ({
    default: ({ href, children, className, onClick }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} className={className} onClick={onClick}>{children}</a>
    ),
}));

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
        it("calls onClick and onTrack when clicked", async () => {
            const onClick = vi.fn();
            const onTrack = vi.fn();
            render(
                <MenuItem
                    to="/blog"
                    selected={false}
                    onClick={onClick}
                    onTrack={onTrack}
                >
                    Blog
                </MenuItem>,
            );
            await userEvent.click(screen.getByRole("link"));
            expect(onClick).toHaveBeenCalledOnce();
            expect(onTrack).toHaveBeenCalledOnce();
        });
    });
});
