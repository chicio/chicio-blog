import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ContinentChart } from "./index";

describe("ContinentChart", () => {
    describe("render", () => {
        it("renders the recharts responsive container", () => {
            const { container } = render(
                <ContinentChart
                    data={[
                        { label: "Europe", users: 50 },
                        { label: "Americas", users: 30 },
                    ]}
                />,
            );

            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });
    });
});
