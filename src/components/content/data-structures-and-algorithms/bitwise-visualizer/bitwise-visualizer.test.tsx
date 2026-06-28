import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import { BitwiseVisualizer } from "./index";

describe("BitwiseVisualizer", () => {
    describe("render", () => {
        it("renders the heading", () => {
            render(<BitwiseVisualizer />);
            expect(screen.getByText("Bitwise Operator Visualizer")).toBeInTheDocument();
        });

        it("renders the A and B input labels", () => {
            render(<BitwiseVisualizer />);
            expect(screen.getAllByText("A:").length).toBeGreaterThan(0);
            expect(screen.getAllByText("B:").length).toBeGreaterThan(0);
        });

        it("renders the operator table headers", () => {
            render(<BitwiseVisualizer />);
            expect(screen.getByText("Operator")).toBeInTheDocument();
            expect(screen.getByText("Decimal")).toBeInTheDocument();
            expect(screen.getByText("Binary")).toBeInTheDocument();
        });

        it("renders known operator rows", () => {
            render(<BitwiseVisualizer />);
            expect(screen.getByText("AND (&)")).toBeInTheDocument();
            expect(screen.getByText("OR (|)")).toBeInTheDocument();
            expect(screen.getByText("XOR (^)")).toBeInTheDocument();
        });
    });
});
