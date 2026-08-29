import { describe, it, expect } from "vitest";
import { render } from "@/test-utils";
import { PerformanceComparisonChart } from "./index";

describe("PerformanceComparisonChart", () => {
    describe("render", () => {
        it("renders without crashing", () => {
            const { container } = render(<PerformanceComparisonChart />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("renders the recharts responsive container", () => {
            const { container } = render(<PerformanceComparisonChart />);
            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });

        it("wraps the chart in a ChartPanel", () => {
            const { container } = render(<PerformanceComparisonChart />);
            expect(container.querySelector("section.glow-container")).toBeInTheDocument();
        });
    });
});
