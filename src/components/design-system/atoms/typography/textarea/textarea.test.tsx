import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./textarea";

describe("Textarea", () => {
    describe("render", () => {
        it("renders a textarea element", () => {
            render(<Textarea aria-label="Message" />);
            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });

        it("applies glow-container and text-accent classes", () => {
            render(<Textarea aria-label="Message" />);
            const textarea = screen.getByRole("textbox");
            expect(textarea.className).toContain("glow-container");
            expect(textarea.className).toContain("text-accent");
        });

        it("appends additional className when provided", () => {
            render(<Textarea aria-label="Message" className="h-32" />);
            const textarea = screen.getByRole("textbox");
            expect(textarea.className).toContain("h-32");
            expect(textarea.className).toContain("glow-container");
        });

        it("forwards native textarea attributes", () => {
            render(<Textarea aria-label="Message" rows={5} placeholder="Write here..." />);
            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("rows", "5");
            expect(textarea).toHaveAttribute("placeholder", "Write here...");
        });
    });

    describe("interaction", () => {
        it("calls onChange when the user types", async () => {
            const onChange = vi.fn();
            render(<Textarea aria-label="Message" onChange={onChange} />);
            await userEvent.type(screen.getByRole("textbox"), "hello");
            expect(onChange).toHaveBeenCalled();
        });
    });
});
