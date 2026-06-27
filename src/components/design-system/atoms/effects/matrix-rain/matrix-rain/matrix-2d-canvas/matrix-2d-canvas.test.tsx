import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Matrix2DCanvas } from "./matrix-2d-canvas";

/**
 * Smoke test only: the canvas animation loop uses requestAnimationFrame and
 * HTMLCanvasElement.getContext("2d") which are absent or minimal in jsdom.
 * We mock the store to avoid triggering the canvas drawing loop entirely.
 */
vi.mock("./use-matrix-2d-canvas-store", () => ({
    useMatrix2dCanvasStore: vi.fn(() => ({
        effects: { setCanvasEl: vi.fn() },
    })),
}));

describe("Matrix2DCanvas", () => {
    describe("render", () => {
        it("mounts a canvas element without throwing", () => {
            const { container } = render(<Matrix2DCanvas fontSize={14} density={0.975} paused={false} />);
            expect(container.querySelector("canvas")).toBeInTheDocument();
        });

        it("applies pointer-events-none positioning classes", () => {
            const { container } = render(<Matrix2DCanvas fontSize={14} density={0.975} paused={false} />);
            const canvas = container.querySelector("canvas") as HTMLCanvasElement;
            expect(canvas.className).toContain("pointer-events-none");
            expect(canvas.className).toContain("absolute");
        });
    });
});
