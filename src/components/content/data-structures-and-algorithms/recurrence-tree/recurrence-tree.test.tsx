import { describe, it, expect } from "vitest";
import { render } from "@/test-utils";
import { RecurrenceTree } from "./index";

describe("RecurrenceTree", () => {
    describe("render", () => {
        it("renders without crashing", () => {
            const { container } = render(<RecurrenceTree />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("renders the recharts responsive container", () => {
            const { container } = render(<RecurrenceTree />);
            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });
    });
});
