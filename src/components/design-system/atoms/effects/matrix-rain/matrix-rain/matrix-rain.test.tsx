import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MatrixRain } from "./matrix-rain";

/**
 * Smoke test only: MatrixRain depends on WebGPU (matrix-rain-webgpu) and a
 * canvas-based fallback — both are unavailable in jsdom. We mock the store and
 * the WebGPU component so the render tree exercises the component without
 * touching browser-only APIs.
 */
vi.mock("matrix-rain-webgpu", () => ({
    MatrixRainWebGPU: () => <div data-testid="webgpu-rain" />,
}));

vi.mock("./matrix-2d-canvas", () => ({
    Matrix2DCanvas: ({ fontSize, density, paused }: { fontSize: number; density: number; paused: boolean }) => (
        <canvas data-testid="2d-canvas" data-fontsize={fontSize} data-density={density} data-paused={String(paused)} />
    ),
}));

vi.mock("./use-matrix-rain-store", () => ({
    useMatrixRainStore: vi.fn(),
}));

import { useMatrixRainStore } from "./use-matrix-rain-store";

const mockStore = vi.mocked(useMatrixRainStore);

const baseSettings = {
    rain: { fontSize: 14, density: 0.975, speed: 1 },
    bloom: { strength: 0.5, radius: 1.0, threshold: 0.1 },
    crt: { enabled: true, curvature: 0.1 },
};

describe("MatrixRain", () => {
    describe("render", () => {
        it("mounts without throwing", () => {
            mockStore.mockReturnValue({
                state: {
                    paused: false,
                    webGpuSupported: null,
                    webGpuFailed: false,
                    settings: baseSettings as never,
                    rain: baseSettings.rain as never,
                    bloom: baseSettings.bloom as never,
                    crt: baseSettings.crt as never,
                },
                effects: { setContainerEl: vi.fn(), onWebGpuError: vi.fn() },
            });
            const { container } = render(<MatrixRain />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("shows the WebGPU rain when webGpuSupported=true and webGpuFailed=false", () => {
            mockStore.mockReturnValue({
                state: {
                    paused: false,
                    webGpuSupported: true,
                    webGpuFailed: false,
                    settings: baseSettings as never,
                    rain: baseSettings.rain as never,
                    bloom: baseSettings.bloom as never,
                    crt: baseSettings.crt as never,
                },
                effects: { setContainerEl: vi.fn(), onWebGpuError: vi.fn() },
            });
            const { getByTestId } = render(<MatrixRain />);
            expect(getByTestId("webgpu-rain")).toBeInTheDocument();
        });

        it("shows the 2D canvas fallback when webGpuSupported=false", () => {
            mockStore.mockReturnValue({
                state: {
                    paused: false,
                    webGpuSupported: false,
                    webGpuFailed: false,
                    settings: baseSettings as never,
                    rain: baseSettings.rain as never,
                    bloom: baseSettings.bloom as never,
                    crt: baseSettings.crt as never,
                },
                effects: { setContainerEl: vi.fn(), onWebGpuError: vi.fn() },
            });
            const { getByTestId } = render(<MatrixRain />);
            expect(getByTestId("2d-canvas")).toBeInTheDocument();
        });

        it("shows the 2D canvas fallback when WebGPU failed at runtime", () => {
            mockStore.mockReturnValue({
                state: {
                    paused: false,
                    webGpuSupported: true,
                    webGpuFailed: true,
                    settings: baseSettings as never,
                    rain: baseSettings.rain as never,
                    bloom: baseSettings.bloom as never,
                    crt: baseSettings.crt as never,
                },
                effects: { setContainerEl: vi.fn(), onWebGpuError: vi.fn() },
            });
            const { getByTestId } = render(<MatrixRain />);
            expect(getByTestId("2d-canvas")).toBeInTheDocument();
        });
    });
});
