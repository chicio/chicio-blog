import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./switch";

describe("Switch", () => {
    describe("render", () => {
        it("renders a switch button", () => {
            render(<Switch checked={false} onChange={vi.fn()} />);
            expect(screen.getByRole("switch")).toBeInTheDocument();
        });

        it("reflects checked=false via aria-checked", () => {
            render(<Switch checked={false} onChange={vi.fn()} />);
            expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
        });

        it("reflects checked=true via aria-checked", () => {
            render(<Switch checked={true} onChange={vi.fn()} />);
            expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
        });

        it("renders with aria-label when label prop is provided", () => {
            render(<Switch checked={false} onChange={vi.fn()} label="Enable notifications" />);
            expect(screen.getByRole("switch", { name: "Enable notifications" })).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onChange with toggled value when clicked while unchecked", async () => {
            const onChange = vi.fn();
            render(<Switch checked={false} onChange={onChange} />);
            await userEvent.click(screen.getByRole("switch"));
            expect(onChange).toHaveBeenCalledWith(true);
        });

        it("calls onChange with toggled value when clicked while checked", async () => {
            const onChange = vi.fn();
            render(<Switch checked={true} onChange={onChange} />);
            await userEvent.click(screen.getByRole("switch"));
            expect(onChange).toHaveBeenCalledWith(false);
        });
    });
});
