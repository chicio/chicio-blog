import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const hasMotionMock = vi.hoisted(() => vi.fn(() => true));

vi.mock("@/components/design-system/state/motion/motion", () => ({
    hasMotion: hasMotionMock,
    motionChangeEvent: "motion-change",
}));

import { useMotionStore } from "./use-motion-store";

describe("useMotionStore", () => {
    beforeEach(() => {
        hasMotionMock.mockReturnValue(true);
    });

    describe("getSnapshot", () => {
        it("returns true when motion is enabled", () => {
            hasMotionMock.mockReturnValue(true);
            const { result } = renderHook(() => useMotionStore());
            expect(result.current).toBe(true);
        });

        it("returns false when motion is disabled", () => {
            hasMotionMock.mockReturnValue(false);
            const { result } = renderHook(() => useMotionStore());
            expect(result.current).toBe(false);
        });
    });

    describe("subscribe/re-render on motion-change event", () => {
        it("re-reads snapshot when motion-change event fires", async () => {
            hasMotionMock.mockReturnValue(true);
            const { result } = renderHook(() => useMotionStore());
            expect(result.current).toBe(true);

            hasMotionMock.mockReturnValue(false);

            await act(async () => {
                window.dispatchEvent(new Event("motion-change"));
            });

            expect(result.current).toBe(false);
        });
    });

    describe("unsubscribe on unmount", () => {
        it("no longer re-renders after unmount", async () => {
            hasMotionMock.mockReturnValue(true);
            const { result, unmount } = renderHook(() => useMotionStore());
            unmount();

            hasMotionMock.mockReturnValue(false);

            await act(async () => {
                window.dispatchEvent(new Event("motion-change"));
            });

            expect(result.current).toBe(true);
        });
    });
});
