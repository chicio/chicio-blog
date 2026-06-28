import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PageIndicatorButton } from "./page-indicator-button";

describe("PageIndicatorButton", () => {
    describe("render", () => {
        it("renders a button with the correct aria-label", () => {
            render(<PageIndicatorButton index={0} isActive={false} onSelect={vi.fn()} />);
            expect(screen.getByRole("button", { name: "Go to image 1" })).toBeInTheDocument();
        });

        it("applies active style when isActive is true", () => {
            render(<PageIndicatorButton index={2} isActive={true} onSelect={vi.fn()} />);
            const btn = screen.getByRole("button", { name: "Go to image 3" });
            expect(btn.className).toContain("bg-primary");
        });

        it("applies inactive style when isActive is false", () => {
            render(<PageIndicatorButton index={0} isActive={false} onSelect={vi.fn()} />);
            const btn = screen.getByRole("button", { name: "Go to image 1" });
            expect(btn.className).toContain("bg-primary-text");
        });
    });

    describe("interaction", () => {
        it("calls onSelect with the index when clicked", async () => {
            const onSelect = vi.fn();
            render(<PageIndicatorButton index={3} isActive={false} onSelect={onSelect} />);
            await userEvent.click(screen.getByRole("button", { name: "Go to image 4" }));
            expect(onSelect).toHaveBeenCalledWith(3);
        });
    });
});
