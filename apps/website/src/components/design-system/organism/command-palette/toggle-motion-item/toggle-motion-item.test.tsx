import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleMotionItem } from "./toggle-motion-item";

vi.mock("cmdk", () => ({
    Command: Object.assign(
        ({ children }: React.PropsWithChildren) => <div>{children}</div>,
        {
            Item: ({
                children,
                onSelect,
                value,
            }: React.PropsWithChildren<{ onSelect?: () => void; value?: string }>) => (
                <button onClick={onSelect} aria-label={value}>
                    {children}
                </button>
            ),
        },
    ),
}));

vi.mock("@/components/design-system/state/motion/motion", () => ({
    writeMotion: vi.fn(),
    hasMotion: () => true,
    motionChangeEvent: "motion-change",
}));

describe("ToggleMotionItem", () => {
    describe("render", () => {
        it("renders the toggle animations item", () => {
            render(<ToggleMotionItem />);
            expect(screen.getByText(/Toggle Animations/)).toBeInTheDocument();
        });

        it("shows current motion state label", () => {
            render(<ToggleMotionItem />);
            expect(screen.getByText(/\[ON\]|\[OFF\]/)).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onTrack when item is selected", async () => {
            const onTrack = vi.fn();
            render(<ToggleMotionItem onTrack={onTrack} />);
            await userEvent.click(screen.getByRole("button", { name: "toggle animations motion" }));
            expect(onTrack).toHaveBeenCalledOnce();
        });
    });
});
