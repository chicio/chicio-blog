import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputField } from "./input-field";

describe("InputField", () => {
    describe("render", () => {
        it("renders an input element", () => {
            render(<InputField aria-label="Search" />);
            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });

        it("applies glow-container and text-accent classes", () => {
            render(<InputField aria-label="Search" />);
            const input = screen.getByRole("textbox");
            expect(input.className).toContain("glow-container");
            expect(input.className).toContain("text-accent");
        });

        it("appends additional className when provided", () => {
            render(<InputField aria-label="Search" className="extra" />);
            const input = screen.getByRole("textbox");
            expect(input.className).toContain("extra");
            expect(input.className).toContain("glow-container");
        });

        it("forwards native input attributes", () => {
            render(<InputField aria-label="Name" placeholder="Enter name" type="text" />);
            const input = screen.getByRole("textbox");
            expect(input).toHaveAttribute("placeholder", "Enter name");
        });
    });

    describe("interaction", () => {
        it("calls onChange when the user types", async () => {
            const onChange = vi.fn();
            render(<InputField aria-label="Search" onChange={onChange} />);
            await userEvent.type(screen.getByRole("textbox"), "hello");
            expect(onChange).toHaveBeenCalled();
        });
    });
});
