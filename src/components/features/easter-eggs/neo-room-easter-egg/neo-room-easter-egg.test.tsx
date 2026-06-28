import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@/test-utils";
import { fireEvent } from "@testing-library/react";
import NeoRoomEasterEgg from "./neo-room-easter-egg";
import type { EasterEggTerminalLines } from "@/types/search/search";

beforeAll(() => {
    globalThis.Audio = class {
        play() {
            return Promise.resolve();
        }
    } as unknown as typeof Audio;
});

vi.mock("@/components/features/easter-eggs/center-container", () => ({
    CenterContainer: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

vi.mock("@/components/design-system/molecules/effects/matrix-terminal", () => ({
    MatrixTerminal: ({ onComplete }: { onComplete?: () => void }) => (
        <button data-testid="matrix-terminal" onClick={onComplete}>
            terminal
        </button>
    ),
}));

vi.mock("@/components/design-system/molecules/buttons/pills-buttons", () => ({
    RedPillButton: ({
        children,
        onClick,
    }: React.PropsWithChildren<{ onClick?: () => void }>) => (
        <button onClick={onClick}>{children}</button>
    ),
}));

const lines: EasterEggTerminalLines = [{ text: "Wake up, Neo...", type: "normal", delay: 0 }];

describe("NeoRoomEasterEgg", () => {
    describe("before terminal completes", () => {
        it("renders the terminal", () => {
            render(<NeoRoomEasterEgg lines={lines} />);
            expect(screen.getByTestId("matrix-terminal")).toBeInTheDocument();
        });

        it("hides the knock button wrapper before completion", () => {
            const { container } = render(<NeoRoomEasterEgg lines={lines} />);
            const button = container.querySelector("button[data-testid='matrix-terminal'] ~ div") as HTMLElement | null;
            const hiddenWrapper = container.querySelector("[style*='visibility: hidden']") as HTMLElement | null;
            expect(hiddenWrapper).toBeInTheDocument();
        });
    });

    describe("after terminal completes", () => {
        it("makes the knock button wrapper visible", async () => {
            const { container } = render(<NeoRoomEasterEgg lines={lines} />);
            const terminal = screen.getByTestId("matrix-terminal");
            fireEvent.click(terminal);
            const visibleWrapper = container.querySelector("[style*='visibility: visible']") as HTMLElement | null;
            expect(visibleWrapper).toBeInTheDocument();
        });
    });
});
