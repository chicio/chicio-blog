import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnchorLink } from "./anchor-link";

describe("AnchorLink", () => {
    describe("render", () => {
        it("renders an anchor with the provided href", () => {
            render(<AnchorLink href="/about">About</AnchorLink>);
            expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
        });

        it("forwards anchor attributes", () => {
            render(
                <AnchorLink href="/about" className="nav" target="_blank">
                    About
                </AnchorLink>,
            );
            const link = screen.getByRole("link");
            expect(link).toHaveClass("nav");
            expect(link).toHaveAttribute("target", "_blank");
        });

        it("does not put the prefetch strategy on the DOM, which would warn", () => {
            render(
                <AnchorLink href="/about" prefetch="hover">
                    About
                </AnchorLink>,
            );
            expect(screen.getByRole("link")).not.toHaveAttribute("prefetch");
        });
    });

    describe("interaction", () => {
        it("calls onClick when clicked", async () => {
            const onClick = vi.fn();
            render(
                <AnchorLink href="/about" onClick={onClick}>
                    About
                </AnchorLink>,
            );
            await userEvent.click(screen.getByRole("link"));
            expect(onClick).toHaveBeenCalledOnce();
        });
    });
});
