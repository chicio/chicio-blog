import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TerminalItem } from "./terminal-item";

vi.mock("cmdk", () => ({
    Command: Object.assign({}, {
        Item: ({ children, onSelect, value }: React.PropsWithChildren<{ onSelect?: () => void; value?: string }>) => (
            <button onClick={onSelect} aria-label={value}>
                {children}
            </button>
        ),
    }),
}));

const terminalButton = () => screen.getByRole("button", { name: "open terminal" });

describe("TerminalItem", () => {
    it("renders the Open terminal label", () => {
        render(<TerminalItem onSelect={vi.fn()} />);
        expect(screen.getByText(/Open terminal/)).toBeInTheDocument();
    });

    it("calls onSelect when selected", async () => {
        const onSelect = vi.fn();
        render(<TerminalItem onSelect={onSelect} />);
        await userEvent.click(terminalButton());
        expect(onSelect).toHaveBeenCalledOnce();
    });
});
