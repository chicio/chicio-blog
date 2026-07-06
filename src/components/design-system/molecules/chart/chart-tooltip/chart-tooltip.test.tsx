import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChartTooltip } from "./chart-tooltip";

describe("ChartTooltip", () => {
    describe("render", () => {
        it("renders nothing when inactive", () => {
            const { container } = render(<ChartTooltip active={false} payload={[]} label="10" />);
            expect(container).toBeEmptyDOMElement();
        });

        it("renders nothing when there is no payload", () => {
            const { container } = render(<ChartTooltip active={true} label="10" />);
            expect(container).toBeEmptyDOMElement();
        });

        it("renders the label and payload rows when active", () => {
            render(
                <ChartTooltip
                    active={true}
                    label="10"
                    payload={[
                        { name: "Merge Sort", value: 5, dataKey: "merge" },
                        { name: "Quick Sort", value: 3, dataKey: "quick" },
                    ]}
                />,
            );

            expect(screen.getByText("n: 10")).toBeInTheDocument();
            expect(screen.getByText("Merge Sort: 5")).toBeInTheDocument();
            expect(screen.getByText("Quick Sort: 3")).toBeInTheDocument();
        });
    });
});
