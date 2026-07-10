import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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

        it("renders a side legend entry with a percentage for each datum", () => {
            render(
                <DonutChart
                    data={[
                        { label: "Desktop", value: 75 },
                        { label: "Mobile", value: 25 },
                    ]}
                />,
            );

            expect(screen.getByText("Desktop")).toBeInTheDocument();
            expect(screen.getByText("75%")).toBeInTheDocument();
            expect(screen.getByText("Mobile")).toBeInTheDocument();
            expect(screen.getByText("25%")).toBeInTheDocument();
        });

        it("renders the optional center label and sublabel", () => {
            render(
                <DonutChart
                    data={[{ label: "Desktop", value: 10 }]}
                    centerLabel="153,325"
                    centerSublabel="users"
                />,
            );

            expect(screen.getByText("153,325")).toBeInTheDocument();
            expect(screen.getByText("users")).toBeInTheDocument();
        });

        it("renders without crashing when data is empty", () => {
            const { container } = render(<DonutChart data={[]} />);
            expect(container.firstChild).toBeInTheDocument();
        });
    });
});
