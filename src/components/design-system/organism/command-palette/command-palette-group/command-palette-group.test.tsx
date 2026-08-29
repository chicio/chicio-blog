import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CommandPaletteGroup } from "./command-palette-group";

vi.mock("cmdk", () => ({
    Command: Object.assign(({ children }: React.PropsWithChildren) => <div>{children}</div>, {
        Group: ({ children, heading }: React.PropsWithChildren<{ heading?: React.ReactNode }>) => (
            <div role="presentation">
                {heading !== undefined && <div data-cmdk-group-heading>{heading}</div>}
                <div role="group">{children}</div>
            </div>
        ),
    }),
}));

describe("CommandPaletteGroup", () => {
    describe("render", () => {
        it("passes its label to cmdk as the group heading, so the group is named", () => {
            render(<CommandPaletteGroup label="Quick Actions">an item</CommandPaletteGroup>);
            expect(screen.getByText("Quick Actions")).toHaveAttribute("data-cmdk-group-heading");
            expect(screen.getByText("an item")).toBeInTheDocument();
        });

        it("renders without a label", () => {
            render(<CommandPaletteGroup>an item</CommandPaletteGroup>);
            expect(screen.getByText("an item")).toBeInTheDocument();
        });
    });
});
