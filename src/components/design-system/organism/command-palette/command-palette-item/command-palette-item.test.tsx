import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandPaletteItem } from "./command-palette-item";

vi.mock("cmdk", () => ({
    Command: Object.assign(({ children }: React.PropsWithChildren) => <div>{children}</div>, {
        Item: ({
            children,
            onSelect,
            value,
        }: React.PropsWithChildren<{ onSelect?: () => void; value?: string }>) => (
            <button onClick={onSelect} aria-label={value}>
                {children}
            </button>
        ),
    }),
}));

describe("CommandPaletteItem", () => {
    const closeListener = vi.fn();

    beforeEach(() => {
        closeListener.mockClear();
        window.addEventListener("command-palette-close", closeListener);
    });

    describe("render", () => {
        it("renders its children", () => {
            render(<CommandPaletteItem value="an item">label</CommandPaletteItem>);
            expect(screen.getByText("label")).toBeInTheDocument();
        });
    });

    describe("selection", () => {
        it("calls onSelect and closes the palette by default", async () => {
            const onSelect = vi.fn();
            render(
                <CommandPaletteItem value="an item" onSelect={onSelect}>
                    label
                </CommandPaletteItem>,
            );
            await userEvent.click(screen.getByRole("button", { name: "an item" }));
            expect(onSelect).toHaveBeenCalledOnce();
            expect(closeListener).toHaveBeenCalledOnce();
        });

        it("keeps the palette open when closeOnSelect is false", async () => {
            const onSelect = vi.fn();
            render(
                <CommandPaletteItem value="an item" onSelect={onSelect} closeOnSelect={false}>
                    label
                </CommandPaletteItem>,
            );
            await userEvent.click(screen.getByRole("button", { name: "an item" }));
            expect(onSelect).toHaveBeenCalledOnce();
            expect(closeListener).not.toHaveBeenCalled();
        });
    });
});
