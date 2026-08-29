import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReadingProgress } from "./use-reading-progress";

describe("useReadingProgress", () => {
    let targetElement: HTMLDivElement;

    beforeEach(() => {
        targetElement = document.createElement("div");
        targetElement.id = "test-content";
        document.body.appendChild(targetElement);

        Object.defineProperty(targetElement, "offsetTop", { value: 0, configurable: true });
        Object.defineProperty(targetElement, "scrollHeight", { value: 2000, configurable: true });
        Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
        Object.defineProperty(window, "innerHeight", { value: 800, configurable: true, writable: true });
    });

    afterEach(() => {
        document.body.removeChild(targetElement);
        vi.restoreAllMocks();
    });

    describe("initial state", () => {
        it("returns 0% progress initially", () => {
            const { result } = renderHook(() => useReadingProgress("test-content"));
            expect(result.current.percentage).toBe(0);
        });

        it("returns started false initially", () => {
            const { result } = renderHook(() => useReadingProgress("test-content"));
            expect(result.current.started).toBe(false);
        });

        it("returns status uploading initially", () => {
            const { result } = renderHook(() => useReadingProgress("test-content"));
            expect(result.current.status).toBe("uploading");
        });
    });

    describe("while scrolling", () => {
        it("updates percentage when user scrolls", async () => {
            const { result } = renderHook(() => useReadingProgress("test-content"));

            await act(async () => {
                Object.defineProperty(window, "scrollY", { value: 600, configurable: true, writable: true });
                window.dispatchEvent(new Event("scroll"));
            });

            expect(result.current.percentage).toBeGreaterThan(0);
            expect(result.current.started).toBe(true);
        });

        it("clamps percentage at 100 when scrolled past end", async () => {
            const { result } = renderHook(() => useReadingProgress("test-content"));

            await act(async () => {
                Object.defineProperty(window, "scrollY", { value: 99999, configurable: true, writable: true });
                window.dispatchEvent(new Event("scroll"));
            });

            expect(result.current.percentage).toBe(100);
            expect(result.current.status).toBe("complete");
        });
    });

    describe("when targetId element does not exist", () => {
        it("does not throw and keeps progress at 0", () => {
            const { result } = renderHook(() => useReadingProgress("non-existent-id"));
            expect(result.current.percentage).toBe(0);
        });
    });

    describe("cleanup", () => {
        it("removes scroll listener on unmount", () => {
            const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
            const { unmount } = renderHook(() => useReadingProgress("test-content"));
            unmount();
            expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
        });
    });
});
