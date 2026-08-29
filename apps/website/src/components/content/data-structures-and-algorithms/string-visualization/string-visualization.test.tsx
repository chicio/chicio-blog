import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { StringVisualization } from "./index";

describe("StringVisualization", () => {
    describe("render", () => {
        it("renders the Concatenate button", () => {
            render(<StringVisualization />);
            expect(screen.getByText("Concatenate")).toBeInTheDocument();
        });

        it("renders the initial 'hello' characters", () => {
            render(<StringVisualization />);
            expect(screen.getByText("h")).toBeInTheDocument();
            expect(screen.getAllByText("l").length).toBeGreaterThan(0);
            expect(screen.getByText("o")).toBeInTheDocument();
        });
    });

    describe("interactions", () => {
        it("shows the concatenated result after clicking Concatenate", async () => {
            render(<StringVisualization />);
            await userEvent.click(screen.getByText("Concatenate"));
            expect(screen.getByText("w")).toBeInTheDocument();
        });
    });
});
