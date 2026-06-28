import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDeviceCapabilities } from "./use-device-capabilities";

describe("useDeviceCapabilities", () => {
    describe("return shape", () => {
        it("returns all required fields", () => {
            const { result } = renderHook(() => useDeviceCapabilities());
            expect(result.current).toHaveProperty("cores");
            expect(result.current).toHaveProperty("saveData");
            expect(result.current).toHaveProperty("isLowEnd");
            expect(result.current).toHaveProperty("deviceMemory");
        });

        it("cores is a positive number", () => {
            const { result } = renderHook(() => useDeviceCapabilities());
            expect(result.current.cores).toBeGreaterThan(0);
        });

        it("saveData is a boolean", () => {
            const { result } = renderHook(() => useDeviceCapabilities());
            expect(typeof result.current.saveData).toBe("boolean");
        });

        it("isLowEnd is a boolean", () => {
            const { result } = renderHook(() => useDeviceCapabilities());
            expect(typeof result.current.isLowEnd).toBe("boolean");
        });
    });

    describe("isLowEnd derivation logic (unit)", () => {
        it("isLowEnd is false when no low-end signal is present (jsdom defaults)", () => {
            const { result } = renderHook(() => useDeviceCapabilities());
            expect(result.current.isLowEnd).toBe(false);
        });
    });
});
