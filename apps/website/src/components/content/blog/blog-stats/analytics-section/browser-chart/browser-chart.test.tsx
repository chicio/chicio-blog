import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserChart } from "./index";

describe("BrowserChart", () => {
    describe("render", () => {
        it("renders a donut with a legend entry per browser and a center count", () => {
            render(
                <BrowserChart
                    data={[
                        { label: "Chrome", users: 60 },
                        { label: "Safari", users: 40 },
                    ]}
                />,
            );

            expect(screen.getByText("Chrome")).toBeInTheDocument();
            expect(screen.getByText("Safari")).toBeInTheDocument();
            expect(screen.getByText("browsers")).toBeInTheDocument();
        });
    });
});
