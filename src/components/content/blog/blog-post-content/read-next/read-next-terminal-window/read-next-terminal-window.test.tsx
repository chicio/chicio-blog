import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import { ReadNextTerminalWindow } from "./index";

describe("ReadNextTerminalWindow", () => {
    describe("render", () => {
        it("renders the children", () => {
            render(
                <ReadNextTerminalWindow title="read next">
                    <p>row content</p>
                </ReadNextTerminalWindow>,
            );
            expect(screen.getByText("row content")).toBeInTheDocument();
        });

        it("renders the terminal prompt", () => {
            render(
                <ReadNextTerminalWindow title="read next">
                    <p>row content</p>
                </ReadNextTerminalWindow>,
            );
            expect(screen.getByText(">")).toBeInTheDocument();
        });

        it("renders the title as an h2 heading", () => {
            render(
                <ReadNextTerminalWindow title="read next">
                    <p>row content</p>
                </ReadNextTerminalWindow>,
            );
            expect(screen.getByRole("heading", { name: "read next", level: 2 })).toBeInTheDocument();
        });

        it("renders the footer hint", () => {
            render(
                <ReadNextTerminalWindow title="read next">
                    <p>row content</p>
                </ReadNextTerminalWindow>,
            );
            expect(screen.getByText("↵ open")).toBeInTheDocument();
        });

        it("applies the glassmorphism treatment", () => {
            const { container } = render(
                <ReadNextTerminalWindow title="read next">
                    <p>row content</p>
                </ReadNextTerminalWindow>,
            );
            expect(container.firstElementChild?.className).toMatch(/glassmorphism/);
        });
    });
});
