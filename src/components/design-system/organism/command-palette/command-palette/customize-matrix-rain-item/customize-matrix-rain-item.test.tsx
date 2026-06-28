import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomizeMatrixRainItem } from "./customize-matrix-rain-item";

const { mockUseWebGpuSupported, mockUseReducedMotions, mockOpenMatrixRainPanel } = vi.hoisted(() => ({
    mockUseWebGpuSupported: vi.fn(),
    mockUseReducedMotions: vi.fn(),
    mockOpenMatrixRainPanel: vi.fn(),
}));

vi.mock("cmdk", () => ({
    Command: Object.assign(({ children }: React.PropsWithChildren) => <div>{children}</div>, {
        Item: ({ children, onSelect, value }: React.PropsWithChildren<{ onSelect?: () => void; value?: string }>) => (
            <button onClick={onSelect} aria-label={value}>
                {children}
            </button>
        ),
    }),
}));

vi.mock("@/components/design-system/hooks/use-webgpu-supported", () => ({
    useWebGpuSupported: mockUseWebGpuSupported,
}));

vi.mock("@/components/design-system/hooks/use-reduced-motions", () => ({
    useReducedMotions: mockUseReducedMotions,
}));

vi.mock("@/components/design-system/state/command-palette/command-palette-events", () => ({
    openMatrixRainPanel: mockOpenMatrixRainPanel,
}));

const customizeButton = () => screen.queryByRole("button", { name: "customize matrix rain" });

describe("CustomizeMatrixRainItem", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseWebGpuSupported.mockReturnValue(true);
        mockUseReducedMotions.mockReturnValue(false);
    });

    describe("visibility", () => {
        it("renders the item when WebGPU is supported and motion is enabled", () => {
            render(<CustomizeMatrixRainItem onClose={vi.fn()} />);
            expect(customizeButton()).toBeInTheDocument();
        });

        it("does not render when WebGPU is unsupported", () => {
            mockUseWebGpuSupported.mockReturnValue(false);
            render(<CustomizeMatrixRainItem onClose={vi.fn()} />);
            expect(customizeButton()).not.toBeInTheDocument();
        });

        it("does not render when the user prefers reduced motion", () => {
            mockUseReducedMotions.mockReturnValue(true);
            render(<CustomizeMatrixRainItem onClose={vi.fn()} />);
            expect(customizeButton()).not.toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onClose and opens the matrix rain panel when selected", async () => {
            const onClose = vi.fn();
            render(<CustomizeMatrixRainItem onClose={onClose} />);
            await userEvent.click(customizeButton()!);
            expect(onClose).toHaveBeenCalledOnce();
            expect(mockOpenMatrixRainPanel).toHaveBeenCalledOnce();
        });

        it("calls onTrack when selected", async () => {
            const onTrack = vi.fn();
            render(<CustomizeMatrixRainItem onClose={vi.fn()} onTrack={onTrack} />);
            await userEvent.click(customizeButton()!);
            expect(onTrack).toHaveBeenCalledOnce();
        });
    });
});
