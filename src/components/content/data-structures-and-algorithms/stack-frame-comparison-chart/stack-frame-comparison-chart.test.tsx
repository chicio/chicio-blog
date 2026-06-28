import { describe, it, expect } from "vitest";
import { render } from "@/test-utils";
import { StackFrameComparisonChart } from "./index";

describe("StackFrameComparisonChart", () => {
    describe("render", () => {
        it("renders without crashing", () => {
            const { container } = render(<StackFrameComparisonChart />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("renders the recharts responsive container", () => {
            const { container } = render(<StackFrameComparisonChart />);
            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });
    });
});
