import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContentContainer } from "./content-container";

describe("ContentContainer", () => {
    describe("render", () => {
        it("renders children", () => {
            render(<ContentContainer><p>Hello</p></ContentContainer>);
            expect(screen.getByText("Hello")).toBeInTheDocument();
        });

        it("wraps children in a div", () => {
            const { container } = render(<ContentContainer>content</ContentContainer>);
            expect(container.firstChild?.nodeName).toBe("DIV");
        });
    });
});
