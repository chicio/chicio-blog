import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { GamesFilter } from "./index";

describe("GamesFilter", () => {
    describe("render", () => {
        it("renders an input field", () => {
            render(<GamesFilter query="" onChange={vi.fn()} />);
            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });

        it("renders the default placeholder", () => {
            render(<GamesFilter query="" onChange={vi.fn()} />);
            expect(screen.getByPlaceholderText("Filter...")).toBeInTheDocument();
        });

        it("renders a custom placeholder", () => {
            render(<GamesFilter query="" onChange={vi.fn()} placeholder="Search game..." />);
            expect(screen.getByPlaceholderText("Search game...")).toBeInTheDocument();
        });

        it("displays the current query value", () => {
            render(<GamesFilter query="zelda" onChange={vi.fn()} />);
            expect(screen.getByDisplayValue("zelda")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onChange when the user types", async () => {
            const onChange = vi.fn();
            render(<GamesFilter query="" onChange={onChange} />);
            await userEvent.type(screen.getByRole("textbox"), "z");
            expect(onChange).toHaveBeenCalled();
        });
    });
});
