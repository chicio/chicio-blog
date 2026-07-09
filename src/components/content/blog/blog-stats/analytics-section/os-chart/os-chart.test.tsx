import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OsChart } from "./index";

describe("OsChart", () => {
    describe("render", () => {
        it("renders a donut with a legend entry per operating system and a center count", () => {
            render(
                <OsChart
                    data={[
                        { label: "Macintosh", users: 55 },
                        { label: "Windows", users: 45 },
                    ]}
                />,
            );

            expect(screen.getByText("Macintosh")).toBeInTheDocument();
            expect(screen.getByText("Windows")).toBeInTheDocument();
            expect(screen.getByText("systems")).toBeInTheDocument();
        });
    });
});
