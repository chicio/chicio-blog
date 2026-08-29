import { describe, it, expect, vi } from "vitest";

vi.mock("matrix-rain-webgpu", () => ({
    isWebGPUSupported: () => false,
}));

import { renderHook } from "@testing-library/react";
import { useWebGpuSupported } from "./use-webgpu-supported";

describe("useWebGpuSupported", () => {
    describe("smoke test with WebGPU platform bit stubbed to false (jsdom)", () => {
        it("returns false when isWebGPUSupported returns false", () => {
            const { result } = renderHook(() => useWebGpuSupported());
            expect(result.current).toBe(false);
        });

        it("returns a boolean or null (never undefined)", () => {
            const { result } = renderHook(() => useWebGpuSupported());
            expect(result.current === null || typeof result.current === "boolean").toBe(true);
        });
    });
});
