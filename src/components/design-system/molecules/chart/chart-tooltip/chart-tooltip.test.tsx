import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ChartTooltipProps } from "./chart-tooltip";
import { ChartTooltip } from "./chart-tooltip";

const makeProps = (overrides: Partial<ChartTooltipProps>): ChartTooltipProps =>
    ({
        active: false,
        payload: [],
        label: "10",
        coordinate: undefined,
        accessibilityLayer: false,
        activeIndex: undefined,
        ...overrides,
    }) as ChartTooltipProps;

const mergeSortPayload = [{ name: "Merge Sort", value: 5, dataKey: "merge", graphicalItemId: "merge" }];

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

        it("defaults to the DSA 'n: ' label prefix when none is provided", () => {
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

        it("uses a custom label prefix when provided, without the DSA 'n: ' text", () => {
            render(
                <ChartTooltip
                    {...makeProps({
                        active: true,
                        label: "2020",
                        labelPrefix: "Year: ",
                        payload: mergeSortPayload,
                    })}
                />,
            );

            expect(screen.getByText("Year: 2020")).toBeInTheDocument();
            expect(screen.queryByText(/^n: /)).not.toBeInTheDocument();
        });

        it("renders just the label when the prefix is an empty string", () => {
            render(
                <ChartTooltip
                    {...makeProps({
                        active: true,
                        label: "react",
                        labelPrefix: "",
                        payload: mergeSortPayload,
                    })}
                />,
            );

            expect(screen.getByText("react")).toBeInTheDocument();
        });
    });
});
