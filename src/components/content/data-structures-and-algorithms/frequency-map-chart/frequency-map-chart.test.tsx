import { describe, it, expect } from "vitest";
import { render } from "@/test-utils";
import { FrequencyMapChart } from "./index";

describe("FrequencyMapChart", () => {
    describe("render", () => {
        it("renders without crashing", () => {
            const { container } = render(<FrequencyMapChart />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("renders the recharts responsive container", () => {
            const { container } = render(<FrequencyMapChart />);
            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });
    });
});
