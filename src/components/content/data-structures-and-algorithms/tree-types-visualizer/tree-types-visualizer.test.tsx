import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { TreeTypesVisualizer } from "./index";

describe("TreeTypesVisualizer", () => {
    describe("render", () => {
        it("renders tab buttons for all tree examples", () => {
            render(<TreeTypesVisualizer />);
            const buttons = screen.getAllByRole("button");
            const labelTexts = buttons.map((b) => b.textContent);
            expect(labelTexts).toContain("Full Binary Tree");
            expect(labelTexts).toContain("Complete Binary Tree");
        });

        it("renders the tree SVG", () => {
            render(<TreeTypesVisualizer />);
            expect(document.querySelector("svg")).toBeInTheDocument();
        });

        it("renders the Previous and Next navigation buttons", () => {
            render(<TreeTypesVisualizer />);
            expect(screen.getByText("Previous")).toBeInTheDocument();
            expect(screen.getByText("Next")).toBeInTheDocument();
        });

        it("renders a description for the selected tree example", () => {
            render(<TreeTypesVisualizer />);
            const descriptionEl = document.querySelector("p.text-center");
            expect(descriptionEl?.textContent).toMatch(/Full Binary Tree/);
        });

        it("wraps the visualizer in a ChartPanel", () => {
            const { container } = render(<TreeTypesVisualizer />);
            expect(container.querySelector("section.glow-container")).toBeInTheDocument();
        });
    });

    describe("navigation", () => {
        it("navigates to the next tree example when Next is clicked", async () => {
            render(<TreeTypesVisualizer />);
            await userEvent.click(screen.getByText("Next"));
            const descriptionEl = document.querySelector("p.text-center");
            expect(descriptionEl?.textContent).toMatch(/Complete Binary Tree/);
        });
    });
});
