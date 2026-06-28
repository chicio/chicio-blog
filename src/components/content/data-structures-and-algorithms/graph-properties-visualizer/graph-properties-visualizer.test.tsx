import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { GraphPropertiesVisualizer } from "./index";

describe("GraphPropertiesVisualizer", () => {
    describe("render", () => {
        it("renders tab buttons for all graph examples", () => {
            render(<GraphPropertiesVisualizer />);
            const buttons = screen.getAllByRole("button");
            const labelTexts = buttons.map((b) => b.textContent);
            expect(labelTexts).toContain("Undirected");
            expect(labelTexts).toContain("Directed");
            expect(labelTexts).toContain("Weighted");
        });

        it("renders the graph SVG", () => {
            render(<GraphPropertiesVisualizer />);
            expect(document.querySelector("svg")).toBeInTheDocument();
        });

        it("renders the Previous and Next navigation buttons", () => {
            render(<GraphPropertiesVisualizer />);
            expect(screen.getByText("Previous")).toBeInTheDocument();
            expect(screen.getByText("Next")).toBeInTheDocument();
        });

        it("renders a description for the selected graph example", () => {
            render(<GraphPropertiesVisualizer />);
            const descriptionEl = document.querySelector("p.text-center");
            expect(descriptionEl?.textContent).toMatch(/Undirected/);
        });
    });

    describe("navigation", () => {
        it("navigates to the next graph example when Next is clicked", async () => {
            render(<GraphPropertiesVisualizer />);
            await userEvent.click(screen.getByText("Next"));
            const descriptionEl = document.querySelector("p.text-center");
            expect(descriptionEl?.textContent).toMatch(/Directed/);
        });
    });
});
