import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollDirection, ScrollDirection } from "./use-scroll-direction";

function setScrollY(value: number) {
    Object.defineProperty(window, "scrollY", { value, configurable: true, writable: true });
}

describe("useScrollDirection", () => {
    beforeEach(() => {
        vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
            cb(0);
            return 0;
        });
        setScrollY(0);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe("initial state", () => {
        it("starts with scroll direction up", () => {
            const { result } = renderHook(() => useScrollDirection());
            expect(result.current).toBe(ScrollDirection.up);
        });
    });

    describe("scrolling down more than threshold from non-zero position", () => {
        it("returns down direction after exceeding threshold", async () => {
            setScrollY(500);
            const { result } = renderHook(() => useScrollDirection());

            await act(async () => {
                setScrollY(700);
                window.dispatchEvent(new Event("scroll"));
            });

            expect(result.current).toBe(ScrollDirection.down);
        });
    });

    describe("scrolling up more than threshold after scrolling down", () => {
        it("returns up direction", async () => {
            setScrollY(500);
            const { result } = renderHook(() => useScrollDirection());

            await act(async () => {
                setScrollY(700);
                window.dispatchEvent(new Event("scroll"));
            });
            expect(result.current).toBe(ScrollDirection.down);

            await act(async () => {
                setScrollY(500);
                window.dispatchEvent(new Event("scroll"));
            });

            expect(result.current).toBe(ScrollDirection.up);
        });
    });

    describe("scrolling less than threshold (100px)", () => {
        it("does not change direction", async () => {
            setScrollY(500);
            const { result } = renderHook(() => useScrollDirection());

            await act(async () => {
                setScrollY(550);
                window.dispatchEvent(new Event("scroll"));
            });

            expect(result.current).toBe(ScrollDirection.up);
        });
    });

    describe("cleanup", () => {
        it("removes scroll listener on unmount", () => {
            const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
            const { unmount } = renderHook(() => useScrollDirection());
            unmount();
            expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
        });
    });
});
