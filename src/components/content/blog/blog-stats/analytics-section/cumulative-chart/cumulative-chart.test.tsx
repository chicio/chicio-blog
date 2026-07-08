import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CumulativeChart } from "./index";

describe("CumulativeChart", () => {
    describe("render", () => {
        it("renders the recharts responsive container for the given series", () => {
            const { container } = render(
                <CumulativeChart
                    data={[
                        { time: Date.UTC(2017, 4, 1), label: "May 2017", estimated: 0, live: null },
                        { time: Date.UTC(2021, 4, 1), label: "May 2021", estimated: 148579, live: 148579 },
                        { time: Date.UTC(2022, 0, 1), label: "January 2022", estimated: null, live: 149579 },
                    ]}
                />,
            );

            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });

        it("renders without crashing when the series is empty", () => {
            const { container } = render(<CumulativeChart data={[]} />);
            expect(container.firstChild).toBeInTheDocument();
        });
    });
});
