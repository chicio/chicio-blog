import { describe, it, expect, vi } from "vitest";
import { render, screen, nextLinkMock } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import { CallToActionInternalWithTracking } from "./call-to-action-internal-with-tracking";

vi.mock("next/link", () => nextLinkMock());

describe("CallToActionInternalWithTracking", () => {
    describe("render", () => {
        it("renders an anchor with the provided href", () => {
            render(<CallToActionInternalWithTracking to="/about">About</CallToActionInternalWithTracking>);
            expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
        });

        it("applies the call-to-action class", () => {
            render(<CallToActionInternalWithTracking to="/about">About</CallToActionInternalWithTracking>);
            expect(screen.getByRole("link")).toHaveClass("call-to-action");
        });

        it("appends extra className when provided", () => {
            render(
                <CallToActionInternalWithTracking to="/about" className="extra">
                    About
                </CallToActionInternalWithTracking>,
            );
            const link = screen.getByRole("link");
            expect(link).toHaveClass("call-to-action");
            expect(link).toHaveClass("extra");
        });

        it("renders children", () => {
            render(<CallToActionInternalWithTracking to="/blog">Read the blog</CallToActionInternalWithTracking>);
            expect(screen.getByText("Read the blog")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onClick when the link is clicked", async () => {
            const onClick = vi.fn();
            render(
                <CallToActionInternalWithTracking to="/blog" onClick={onClick}>
                    Blog
                </CallToActionInternalWithTracking>,
            );
            await userEvent.click(screen.getByRole("link"));
            expect(onClick).toHaveBeenCalledOnce();
        });
    });

    describe("prefetch", () => {
        it("uses Next's default prefetching (CTAs are primary actions)", () => {
            render(<CallToActionInternalWithTracking to="/blog">Blog</CallToActionInternalWithTracking>);
            expect(screen.getByRole("link")).toHaveAttribute("data-prefetch", "undefined");
        });
    });
});
