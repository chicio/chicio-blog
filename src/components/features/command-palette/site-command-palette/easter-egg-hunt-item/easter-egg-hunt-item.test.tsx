import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EasterEggHuntItem } from "./easter-egg-hunt-item";

vi.mock("cmdk", () => ({
    Command: Object.assign({}, {
        Item: ({ children, onSelect, value }: React.PropsWithChildren<{ onSelect?: () => void; value?: string }>) => (
            <button onClick={onSelect} aria-label={value}>
                {children}
            </button>
        ),
    }),
}));

const easterEggHuntButton = () => screen.getByRole("button", { name: "easter egg hunt" });

describe("EasterEggHuntItem", () => {
    it("renders the Easter Egg Hunt label", () => {
        render(<EasterEggHuntItem onSelect={vi.fn()} />);
        expect(screen.getByText(/Easter Egg Hunt/)).toBeInTheDocument();
    });

    it("calls onSelect when selected", async () => {
        const onSelect = vi.fn();
        render(<EasterEggHuntItem onSelect={onSelect} />);
        await userEvent.click(easterEggHuntButton());
        expect(onSelect).toHaveBeenCalledOnce();
    });
});
