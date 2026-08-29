import { describe, it, expect } from "vitest";
import { render } from "@/test-utils";
import { TimeVsSpaceTradeoffVisualizer } from "./index";

describe("TimeVsSpaceTradeoffVisualizer", () => {
    describe("render", () => {
        it("renders without crashing", () => {
            const { container } = render(<TimeVsSpaceTradeoffVisualizer />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("renders the recharts responsive container", () => {
            const { container } = render(<TimeVsSpaceTradeoffVisualizer />);
            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });

        it("wraps the chart in a ChartPanel", () => {
            const { container } = render(<TimeVsSpaceTradeoffVisualizer />);
            expect(container.querySelector("section.glow-container")).toBeInTheDocument();
        });
    });
});
