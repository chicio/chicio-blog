import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HamburgerMenu } from "./hamburger-menu";

describe("HamburgerMenu", () => {
    describe("render", () => {
        it("renders an SVG icon", () => {
            const { container } = render(<HamburgerMenu onClick={vi.fn()} />);
            expect(container.querySelector("svg")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onClick when the icon is clicked", async () => {
            const onClick = vi.fn();
            const { container } = render(<HamburgerMenu onClick={onClick} />);
            await userEvent.click(container.querySelector("svg")!);
            expect(onClick).toHaveBeenCalledOnce();
        });
    });
});
