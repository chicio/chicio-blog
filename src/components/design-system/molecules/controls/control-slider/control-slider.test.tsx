import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ControlSlider } from "./control-slider";

describe("ControlSlider", () => {
    describe("render", () => {
        it("renders the label", () => {
            render(
                <ControlSlider
                    label="Font Size"
                    value={16}
                    min={8}
                    max={32}
                    step={1}
                    onChange={vi.fn()}
                />,
            );
            expect(screen.getByText("Font Size")).toBeInTheDocument();
        });

        it("renders the current value", () => {
            render(
                <ControlSlider
                    label="Density"
                    value={42}
                    min={0}
                    max={100}
                    step={1}
                    onChange={vi.fn()}
                />,
            );
            expect(screen.getByText("42")).toBeInTheDocument();
        });

        it("renders the displayValue when provided instead of raw value", () => {
            render(
                <ControlSlider
                    label="Speed"
                    value={0.5}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={vi.fn()}
                    displayValue="50%"
                />,
            );
            expect(screen.getByText("50%")).toBeInTheDocument();
        });

        it("renders a range input with correct min/max/step", () => {
            render(
                <ControlSlider
                    label="Volume"
                    value={50}
                    min={0}
                    max={100}
                    step={5}
                    onChange={vi.fn()}
                />,
            );
            const input = screen.getByRole("slider");
            expect(input).toHaveAttribute("min", "0");
            expect(input).toHaveAttribute("max", "100");
            expect(input).toHaveAttribute("step", "5");
        });
    });

    describe("interaction", () => {
        it("calls onChange with a parsed float when the range input changes", () => {
            const onChange = vi.fn();
            render(
                <ControlSlider
                    label="Size"
                    value={10}
                    min={0}
                    max={20}
                    step={1}
                    onChange={onChange}
                />,
            );
            const input = screen.getByRole("slider");
            fireEvent.change(input, { target: { value: "15" } });
            expect(onChange).toHaveBeenCalledWith(15);
        });
    });
});
