import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ParagraphTitleWithIcon } from "./paragraph-title-with-icon";

describe("ParagraphTitleWithIcon", () => {
    describe("render", () => {
        it("renders the children text", () => {
            render(<ParagraphTitleWithIcon icon={<span>icon</span>}>Section Heading</ParagraphTitleWithIcon>);
            expect(screen.getByText("Section Heading")).toBeInTheDocument();
        });

        it("renders the icon", () => {
            render(<ParagraphTitleWithIcon icon={<span data-testid="test-icon">X</span>}>Title</ParagraphTitleWithIcon>);
            expect(screen.getByTestId("test-icon")).toBeInTheDocument();
        });
    });
});
