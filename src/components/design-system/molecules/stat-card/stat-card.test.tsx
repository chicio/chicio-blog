import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "./stat-card";

describe("StatCard", () => {
    describe("render", () => {
        it("renders the value and the label", () => {
            render(<StatCard value={42} label="Posts" />);
            expect(screen.getByText("42")).toBeInTheDocument();
            expect(screen.getByText("Posts")).toBeInTheDocument();
        });

        it("renders a string value as-is", () => {
            render(<StatCard value="1,234" label="Words" />);
            expect(screen.getByText("1,234")).toBeInTheDocument();
        });

        it("does not render an icon slot when none is provided", () => {
            const { container } = render(<StatCard value={1} label="Years" />);
            expect(container.querySelectorAll("span")).toHaveLength(2);
        });

        it("renders the icon slot when provided", () => {
            render(
                <StatCard
                    value={1}
                    label="Years"
                    icon={<span data-testid="stat-icon">*</span>}
                />,
            );
            expect(screen.getByTestId("stat-icon")).toBeInTheDocument();
        });

        it("keeps large formatted numbers from overflowing the card", () => {
            render(<StatCard value="144,446" label="Words" />);
            const value = screen.getByText("144,446");
            expect(value).toHaveClass("break-words", "tabular-nums", "w-full");
            expect(value.parentElement).toHaveClass("min-w-0");
        });
    });
});
