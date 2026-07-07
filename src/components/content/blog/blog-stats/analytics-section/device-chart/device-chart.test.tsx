import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DeviceChart } from "./index";

describe("DeviceChart", () => {
    describe("render", () => {
        it("renders the recharts responsive container", () => {
            const { container } = render(
                <DeviceChart
                    data={[
                        { label: "Desktop", users: 60 },
                        { label: "Mobile", users: 30 },
                    ]}
                />,
            );

            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });
    });
});
