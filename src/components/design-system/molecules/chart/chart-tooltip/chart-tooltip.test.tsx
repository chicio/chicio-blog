import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { TooltipContentProps } from "recharts";
import { ChartTooltip } from "./chart-tooltip";

const makeProps = (overrides: Partial<TooltipContentProps>): TooltipContentProps =>
    ({
        active: false,
        payload: [],
        label: "10",
        coordinate: undefined,
        accessibilityLayer: false,
        activeIndex: undefined,
        ...overrides,
    }) as TooltipContentProps;

describe("ChartTooltip", () => {
    describe("render", () => {
        it("renders nothing when inactive", () => {
            const { container } = render(<ChartTooltip {...makeProps({ active: false })} />);
            expect(container).toBeEmptyDOMElement();
        });

        it("renders nothing when there is no payload", () => {
            const { container } = render(
                <ChartTooltip {...makeProps({ active: true, payload: undefined })} />,
            );
            expect(container).toBeEmptyDOMElement();
        });

        it("renders the label and payload rows when active", () => {
            render(
                <ChartTooltip
                    {...makeProps({
                        active: true,
                        payload: [
                            { name: "Merge Sort", value: 5, dataKey: "merge", graphicalItemId: "merge" },
                            { name: "Quick Sort", value: 3, dataKey: "quick", graphicalItemId: "quick" },
                        ],
                    })}
                />,
            );

            expect(screen.getByText("n: 10")).toBeInTheDocument();
            expect(screen.getByText("Merge Sort: 5")).toBeInTheDocument();
            expect(screen.getByText("Quick Sort: 3")).toBeInTheDocument();
        });
    });
});
