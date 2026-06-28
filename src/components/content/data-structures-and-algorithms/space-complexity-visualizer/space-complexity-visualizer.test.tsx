import { describe, it, expect } from "vitest";
import { render } from "@/test-utils";
import { SpaceComplexityVisualizer } from "./index";

describe("SpaceComplexityVisualizer", () => {
    describe("render", () => {
        it("renders without crashing", () => {
            const { container } = render(<SpaceComplexityVisualizer />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("renders the recharts responsive container", () => {
            const { container } = render(<SpaceComplexityVisualizer />);
            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });
    });
});
