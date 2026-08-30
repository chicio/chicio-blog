import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandPaletteContext } from "../../../state/command-palette/command-palette-context";
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

const renderInPalette = (close: () => void, node: React.ReactNode) =>
    render(<CommandPaletteContext.Provider value={close}>{node}</CommandPaletteContext.Provider>);

describe("CommandPaletteItem", () => {
    describe("render", () => {
        it("renders its children", () => {
            renderInPalette(vi.fn(), <CommandPaletteItem value="an item">label</CommandPaletteItem>);
            expect(screen.getByText("label")).toBeInTheDocument();
        });
    });

    describe("selection", () => {
        it("calls onSelect and closes its own palette by default", async () => {
            const onSelect = vi.fn();
            const close = vi.fn();
            renderInPalette(
                close,
                <CommandPaletteItem value="an item" onSelect={onSelect}>
                    label
                </CommandPaletteItem>,
            );
            await userEvent.click(screen.getByRole("button", { name: "an item" }));
            expect(onSelect).toHaveBeenCalledOnce();
            expect(close).toHaveBeenCalledOnce();
        });

        it("keeps the palette open when closeOnSelect is false", async () => {
            const onSelect = vi.fn();
            const close = vi.fn();
            renderInPalette(
                close,
                <CommandPaletteItem value="an item" onSelect={onSelect} closeOnSelect={false}>
                    label
                </CommandPaletteItem>,
            );
            await userEvent.click(screen.getByRole("button", { name: "an item" }));
            expect(onSelect).toHaveBeenCalledOnce();
            expect(close).not.toHaveBeenCalled();
        });

        it("still selects when rendered outside a palette", async () => {
            const onSelect = vi.fn();
            render(
                <CommandPaletteItem value="an item" onSelect={onSelect}>
                    label
                </CommandPaletteItem>,
            );
            await userEvent.click(screen.getByRole("button", { name: "an item" }));
            expect(onSelect).toHaveBeenCalledOnce();
        });
    });
});
