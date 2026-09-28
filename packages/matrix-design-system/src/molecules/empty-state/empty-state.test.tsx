import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
    describe("render", () => {
        it("names the subject and quotes the query", () => {
            render(<EmptyState icon={<span />} subject="games" query="zelda" />);
            expect(screen.getByText("No games found for “zelda”.")).toBeInTheDocument();
        });

        it("renders the icon slot hidden from assistive technology", () => {
            render(<EmptyState icon={<span data-testid="empty-icon" />} subject="games" query="zelda" />);
            expect(screen.getByTestId("empty-icon").parentElement).toHaveAttribute("aria-hidden", "true");
        });
    });
});
