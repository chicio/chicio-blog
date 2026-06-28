import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { DynamicArrayVisualizer } from "./index";

describe("DynamicArrayVisualizer", () => {
    describe("render", () => {
        it("renders capacity and size information", () => {
            render(<DynamicArrayVisualizer />);
            expect(screen.getByText(/Capacity:/)).toBeInTheDocument();
            expect(screen.getByText(/Size:/)).toBeInTheDocument();
        });

        it("renders the Push button", () => {
            render(<DynamicArrayVisualizer />);
            expect(screen.getByText("Push")).toBeInTheDocument();
        });

        it("renders the Reset button", () => {
            render(<DynamicArrayVisualizer />);
            expect(screen.getByText("Reset")).toBeInTheDocument();
        });

        it("shows the initial size of 3", () => {
            render(<DynamicArrayVisualizer />);
            expect(screen.getByText(/Capacity: 4, Size: 3/)).toBeInTheDocument();
        });
    });

    describe("interactions", () => {
        it("increments the size when Push is clicked", async () => {
            render(<DynamicArrayVisualizer />);
            await userEvent.click(screen.getByText("Push"));
            expect(screen.getByText(/Size: 4/)).toBeInTheDocument();
        });

        it("resets the array to initial state when Reset is clicked after pushing", async () => {
            render(<DynamicArrayVisualizer />);
            await userEvent.click(screen.getByText("Push"));
            await userEvent.click(screen.getByText("Reset"));
            expect(screen.getByText(/Size: 3/)).toBeInTheDocument();
        });
    });
});
