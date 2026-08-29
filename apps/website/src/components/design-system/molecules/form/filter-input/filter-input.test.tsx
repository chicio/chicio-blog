import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { FilterInput } from "./index";

describe("FilterInput", () => {
    describe("render", () => {
        it("renders an input field", () => {
            render(<FilterInput value="" onChange={vi.fn()} />);
            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });

        it("renders the default placeholder", () => {
            render(<FilterInput value="" onChange={vi.fn()} />);
            expect(screen.getByPlaceholderText("Filter...")).toBeInTheDocument();
        });

        it("renders a custom placeholder", () => {
            render(<FilterInput value="" onChange={vi.fn()} placeholder="Search game..." />);
            expect(screen.getByPlaceholderText("Search game...")).toBeInTheDocument();
        });

        it("displays the current value", () => {
            render(<FilterInput value="zelda" onChange={vi.fn()} />);
            expect(screen.getByDisplayValue("zelda")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onChange when the user types", async () => {
            const onChange = vi.fn();
            render(<FilterInput value="" onChange={onChange} />);
            await userEvent.type(screen.getByRole("textbox"), "z");
            expect(onChange).toHaveBeenCalled();
        });
    });
});
