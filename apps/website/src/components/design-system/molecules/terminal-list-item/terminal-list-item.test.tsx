import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TerminalListItem } from "./terminal-list-item";

describe("TerminalListItem", () => {
    describe("render", () => {
        it("renders the title with a terminal prompt", () => {
            render(<TerminalListItem title="Test Article" description="A great article" />);
            expect(screen.getByText(/>\s*Test Article/)).toBeInTheDocument();
        });

        it("renders the description", () => {
            render(<TerminalListItem title="Test Article" description="A great article" />);
            expect(screen.getByText("A great article")).toBeInTheDocument();
        });
    });
});
