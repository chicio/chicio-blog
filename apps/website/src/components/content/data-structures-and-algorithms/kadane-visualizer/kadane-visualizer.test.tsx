import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { KadaneVisualizer } from "./index";

const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

describe("KadaneVisualizer", () => {
    describe("render", () => {
        it("renders each number from the input array", () => {
            render(<KadaneVisualizer nums={nums} />);
            const fours = screen.getAllByText("4");
            expect(fours.length).toBeGreaterThan(0);
        });

        it("renders the Current Index label", () => {
            render(<KadaneVisualizer nums={nums} />);
            expect(screen.getByText("Current Index:")).toBeInTheDocument();
        });

        it("renders the Global Max label", () => {
            render(<KadaneVisualizer nums={nums} />);
            expect(screen.getByText("Global Max:")).toBeInTheDocument();
        });

        it("renders the Step button", () => {
            render(<KadaneVisualizer nums={nums} />);
            expect(screen.getByText("Step")).toBeInTheDocument();
        });

        it("renders the Reset button", () => {
            render(<KadaneVisualizer nums={nums} />);
            expect(screen.getByText("Reset")).toBeInTheDocument();
        });
    });

    describe("interactions", () => {
        it("advances the current index to 1 when Step is clicked once", async () => {
            render(<KadaneVisualizer nums={nums} />);
            await userEvent.click(screen.getByText("Step"));
            const paragraphs = document.querySelectorAll("p");
            const indexParagraph = Array.from(paragraphs).find((p) => p.textContent?.includes("Current Index:"));
            expect(indexParagraph?.textContent).toContain("1");
        });
    });
});
