import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { StackVisualizer } from "./index";

describe("StackVisualizer", () => {
    describe("render", () => {
        it("renders the Push button", () => {
            render(<StackVisualizer />);
            expect(screen.getByText("Push")).toBeInTheDocument();
        });

        it("renders the Pop button", () => {
            render(<StackVisualizer />);
            expect(screen.getByText("Pop")).toBeInTheDocument();
        });

        it("renders the max capacity description", () => {
            render(<StackVisualizer />);
            expect(screen.getByText(/max capacity/i)).toBeInTheDocument();
        });
    });

    describe("interactions", () => {
        it("adds a value to the stack when Push is clicked", async () => {
            render(<StackVisualizer />);
            const initialCells = document.querySelectorAll(".bg-primary-dark");
            await userEvent.click(screen.getByText("Push"));
            const cellsAfterPush = document.querySelectorAll(".bg-primary-dark");
            expect(cellsAfterPush.length).toBeGreaterThan(initialCells.length);
        });
    });
});
