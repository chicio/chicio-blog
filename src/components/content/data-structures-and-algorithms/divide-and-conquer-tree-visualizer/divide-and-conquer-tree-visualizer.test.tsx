import { describe, it, expect } from "vitest";
import { render } from "@/test-utils";
import { DivideAndConquerTreeVisualizer } from "./index";

describe("DivideAndConquerTreeVisualizer", () => {
    describe("render", () => {
        it("renders without crashing", () => {
            const { container } = render(<DivideAndConquerTreeVisualizer />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("renders the recharts responsive container", () => {
            const { container } = render(<DivideAndConquerTreeVisualizer />);
            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });

        it("wraps the chart in a ChartPanel", () => {
            const { container } = render(<DivideAndConquerTreeVisualizer />);
            expect(container.querySelector("section.glow-container")).toBeInTheDocument();
        });
    });
});
