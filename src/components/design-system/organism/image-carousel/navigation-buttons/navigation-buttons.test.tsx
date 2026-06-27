import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavigationButtons } from "./navigation-buttons";

describe("NavigationButtons", () => {
    describe("render", () => {
        it("renders the previous button", () => {
            render(<NavigationButtons onPrevious={vi.fn()} onNext={vi.fn()} />);
            expect(screen.getByRole("button", { name: "Previous image" })).toBeInTheDocument();
        });

        it("renders the next button", () => {
            render(<NavigationButtons onPrevious={vi.fn()} onNext={vi.fn()} />);
            expect(screen.getByRole("button", { name: "Next image" })).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onPrevious when previous button is clicked", async () => {
            const onPrevious = vi.fn();
            render(<NavigationButtons onPrevious={onPrevious} onNext={vi.fn()} />);
            await userEvent.click(screen.getByRole("button", { name: "Previous image" }));
            expect(onPrevious).toHaveBeenCalledOnce();
        });

        it("calls onNext when next button is clicked", async () => {
            const onNext = vi.fn();
            render(<NavigationButtons onPrevious={vi.fn()} onNext={onNext} />);
            await userEvent.click(screen.getByRole("button", { name: "Next image" }));
            expect(onNext).toHaveBeenCalledOnce();
        });
    });
});
