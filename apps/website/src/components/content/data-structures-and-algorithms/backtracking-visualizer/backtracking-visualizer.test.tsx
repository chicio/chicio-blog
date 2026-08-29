import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import { BacktrackingVisualizer } from "./index";

describe("BacktrackingVisualizer", () => {
    describe("render", () => {
        it("renders the current path label", () => {
            render(<BacktrackingVisualizer />);
            expect(screen.getByText(/current path/i)).toBeInTheDocument();
        });

        it("renders the completed solutions label", () => {
            render(<BacktrackingVisualizer />);
            expect(screen.getByText(/completed solutions/i)).toBeInTheDocument();
        });

        it("renders the Run button", () => {
            render(<BacktrackingVisualizer />);
            expect(screen.getByText("Run")).toBeInTheDocument();
        });

        it("renders the Reset button", () => {
            render(<BacktrackingVisualizer />);
            expect(screen.getByText("Reset")).toBeInTheDocument();
        });
    });
});
