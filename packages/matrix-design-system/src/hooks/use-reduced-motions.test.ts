import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReducedMotions } from "./use-reduced-motions";

vi.mock("./use-motion-store", () => ({
    useMotionStore: vi.fn(),
}));

vi.mock("./use-device-capabilities", () => ({
    useDeviceCapabilities: vi.fn(),
}));

import { useMotionStore } from "./use-motion-store";
import { useDeviceCapabilities } from "./use-device-capabilities";

const mockUseMotionStore = vi.mocked(useMotionStore);
const mockUseDeviceCapabilities = vi.mocked(useDeviceCapabilities);

const makeCapabilities = (isLowEnd: boolean) => ({
    deviceMemory: undefined,
    cores: 4,
    saveData: false,
    isLowEnd,
});

describe("useReducedMotions", () => {
    describe("when motion is enabled and device is not low-end", () => {
        it("returns false (motion allowed)", () => {
            mockUseMotionStore.mockReturnValue(true);
            mockUseDeviceCapabilities.mockReturnValue(makeCapabilities(false));
            const { result } = renderHook(() => useReducedMotions());
            expect(result.current).toBe(false);
        });
    });

    describe("when motion is disabled by user", () => {
        it("returns true (motion should be reduced)", () => {
            mockUseMotionStore.mockReturnValue(false);
            mockUseDeviceCapabilities.mockReturnValue(makeCapabilities(false));
            const { result } = renderHook(() => useReducedMotions());
            expect(result.current).toBe(true);
        });
    });

    describe("when device is low-end (even if motion is enabled)", () => {
        it("returns true (motion should be reduced)", () => {
            mockUseMotionStore.mockReturnValue(true);
            mockUseDeviceCapabilities.mockReturnValue(makeCapabilities(true));
            const { result } = renderHook(() => useReducedMotions());
            expect(result.current).toBe(true);
        });
    });

    describe("when both motion is disabled and device is low-end", () => {
        it("returns true", () => {
            mockUseMotionStore.mockReturnValue(false);
            mockUseDeviceCapabilities.mockReturnValue(makeCapabilities(true));
            const { result } = renderHook(() => useReducedMotions());
            expect(result.current).toBe(true);
        });
    });
});
