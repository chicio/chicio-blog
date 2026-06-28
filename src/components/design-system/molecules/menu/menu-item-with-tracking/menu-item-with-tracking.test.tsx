import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuItemWithTracking } from "./menu-item-with-tracking";

vi.mock("next/link", () => ({
    default: ({ href, children, className, onClick }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} className={className} onClick={onClick}>{children}</a>
    ),
}));

describe("MenuItemWithTracking", () => {
    describe("render", () => {
        it("renders children text", () => {
            render(<MenuItemWithTracking to="/blog" selected={false}>Blog</MenuItemWithTracking>);
            expect(screen.getByText("Blog")).toBeInTheDocument();
        });

        it("renders as an internal link when external is false", () => {
            render(<MenuItemWithTracking to="/blog" selected={false}>Blog</MenuItemWithTracking>);
            expect(screen.getByRole("link")).toHaveAttribute("href", "/blog");
        });

        it("renders as an anchor tag when external is true", () => {
            render(
                <MenuItemWithTracking to="https://example.com" selected={false} external={true}>
                    External
                </MenuItemWithTracking>,
            );
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("href", "https://example.com");
            expect(link).toHaveAttribute("target", "_blank");
        });
    });

    describe("props", () => {
        it("applies accent class when selected is true", () => {
            render(<MenuItemWithTracking to="/blog" selected={true}>Blog</MenuItemWithTracking>);
            expect(screen.getByRole("link")).toHaveClass("text-accent");
        });

        it("applies primary-text class when selected is false", () => {
            render(<MenuItemWithTracking to="/blog" selected={false}>Blog</MenuItemWithTracking>);
            expect(screen.getByRole("link")).toHaveClass("text-primary-text");
        });
    });

    describe("interaction", () => {
        it("calls onClick and onClickCallback when clicked", async () => {
            const onClick = vi.fn();
            const onClickCallback = vi.fn();
            render(
                <MenuItemWithTracking
                    to="/blog"
                    selected={false}
                    onClick={onClick}
                    onClickCallback={onClickCallback}
                >
                    Blog
                </MenuItemWithTracking>,
            );
            await userEvent.click(screen.getByRole("link"));
            expect(onClick).toHaveBeenCalledOnce();
            expect(onClickCallback).toHaveBeenCalledOnce();
        });
    });
});
