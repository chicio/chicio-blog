import { describe, it, expect } from "vitest";
import { render } from "@/test-utils";
import { ComplexityGrowthVisualizer } from "./index";

describe("ComplexityGrowthVisualizer", () => {
    describe("render", () => {
        it("renders without crashing", () => {
            const { container } = render(<ComplexityGrowthVisualizer />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("renders the recharts responsive container", () => {
            const { container } = render(<ComplexityGrowthVisualizer />);
            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });
    });
});
