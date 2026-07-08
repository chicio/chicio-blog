import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DonutChart } from "./index";

describe("DonutChart", () => {
    describe("render", () => {
        it("renders the recharts responsive container for the given data", () => {
            const { container } = render(
                <DonutChart
                    data={[
                        { label: "Desktop", value: 60 },
                        { label: "Mobile", value: 30 },
                    ]}
                />,
            );

            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });

        it("renders without crashing when data is empty", () => {
            const { container } = render(<DonutChart data={[]} />);
            expect(container.firstChild).toBeInTheDocument();
        });
    });
});
