import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { RecursiveCallStackVisualizer } from "./index";

describe("RecursiveCallStackVisualizer", () => {
    describe("render", () => {
        it("renders the Call Stack heading", () => {
            render(<RecursiveCallStackVisualizer />);
            expect(screen.getByText(/call stack/i)).toBeInTheDocument();
        });

        it("renders the Return value label", () => {
            render(<RecursiveCallStackVisualizer />);
            expect(screen.getByText(/return value/i)).toBeInTheDocument();
        });

        it("renders the Step button", () => {
            render(<RecursiveCallStackVisualizer />);
            expect(screen.getByText("Step")).toBeInTheDocument();
        });

        it("renders the Reset button", () => {
            render(<RecursiveCallStackVisualizer />);
            expect(screen.getByText("Reset")).toBeInTheDocument();
        });

        it("renders the initial stack frame sum(3)", () => {
            render(<RecursiveCallStackVisualizer />);
            expect(screen.getByText(/sum\(3\)/)).toBeInTheDocument();
        });
    });

    describe("interactions", () => {
        it("pushes a new frame to the stack when Step is clicked from the initial state", async () => {
            render(<RecursiveCallStackVisualizer />);
            await userEvent.click(screen.getByText("Step"));
            const frames = screen.getAllByText(/sum\(\d+\)/);
            expect(frames.length).toBe(2);
        });

        it("resets the stack to the initial state when Reset is clicked", async () => {
            render(<RecursiveCallStackVisualizer />);
            await userEvent.click(screen.getByText("Step"));
            await userEvent.click(screen.getByText("Reset"));
            const frames = screen.getAllByText(/sum\(\d+\)/);
            expect(frames.length).toBe(1);
        });
    });
});
