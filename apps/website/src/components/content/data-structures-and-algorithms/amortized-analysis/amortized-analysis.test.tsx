import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import { AmortizedAnalysis } from "./index";

describe("AmortizedAnalysis", () => {
    describe("render", () => {
        it("renders without crashing", () => {
            const { container } = render(<AmortizedAnalysis />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("renders the recharts LineChart container", () => {
            const { container } = render(<AmortizedAnalysis />);
            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });

        it("wraps the chart in a ChartPanel", () => {
            const { container } = render(<AmortizedAnalysis />);
            expect(container.querySelector("section.glow-container")).toBeInTheDocument();
        });
    });
});
