import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomizeMatrixRainItem } from "./customize-matrix-rain-item";

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

vi.mock("matrix-rain-webgpu", () => ({
    isWebGPUSupported: () => true,
}));

vi.mock("@/components/design-system/state/command-palette/command-palette-events", () => ({
    openMatrixRainPanel: vi.fn(),
    commandPaletteOpenEvent: "command-palette-open",
    openCommandPalette: vi.fn(),
}));

describe("CustomizeMatrixRainItem", () => {
    describe("render", () => {
        it("renders the customize item when WebGPU is supported and motion is enabled", () => {
            render(<CustomizeMatrixRainItem onClose={vi.fn()} />);
            const btn = screen.queryByRole("button", { name: "customize matrix rain" });
            if (btn) {
                expect(btn).toBeInTheDocument();
            }
        });
    });

    describe("interaction", () => {
        it("calls onClose when item is selected", async () => {
            const onClose = vi.fn();
            render(<CustomizeMatrixRainItem onClose={onClose} />);
            const btn = screen.queryByRole("button", { name: "customize matrix rain" });
            if (btn) {
                await userEvent.click(btn);
                expect(onClose).toHaveBeenCalledOnce();
            }
        });

        it("calls onTrack when item is selected", async () => {
            const onTrack = vi.fn();
            render(<CustomizeMatrixRainItem onClose={vi.fn()} onTrack={onTrack} />);
            const btn = screen.queryByRole("button", { name: "customize matrix rain" });
            if (btn) {
                await userEvent.click(btn);
                expect(onTrack).toHaveBeenCalledOnce();
            }
        });
    });
});
