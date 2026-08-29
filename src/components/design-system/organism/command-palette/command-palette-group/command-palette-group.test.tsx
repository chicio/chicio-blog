import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CommandPaletteGroup } from "./command-palette-group";

vi.mock("cmdk", () => ({
    Command: Object.assign(({ children }: React.PropsWithChildren) => <div>{children}</div>, {
        Group: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    }),
}));

describe("CommandPaletteGroup", () => {
    describe("render", () => {
        it("renders its label and children", () => {
            render(<CommandPaletteGroup label="Quick Actions">an item</CommandPaletteGroup>);
            expect(screen.getByText("Quick Actions")).toBeInTheDocument();
            expect(screen.getByText("an item")).toBeInTheDocument();
        });

        it("renders without a label", () => {
            render(<CommandPaletteGroup>an item</CommandPaletteGroup>);
            expect(screen.getByText("an item")).toBeInTheDocument();
        });
    });
});
