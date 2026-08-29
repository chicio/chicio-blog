import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTypewriter } from "./use-typewriter";

describe("useTypewriter", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("initial state", () => {
        it("starts with empty currentText", () => {
            const { result } = renderHook(() => useTypewriter([{ text: "Hello" }]));
            expect(result.current.currentText).toBe("");
        });

        it("starts with isComplete false when there are lines", () => {
            const { result } = renderHook(() => useTypewriter([{ text: "Hello" }]));
            expect(result.current.isComplete).toBe(false);
        });

        it("starts with empty completedLines", () => {
            const { result } = renderHook(() => useTypewriter([{ text: "Hello" }]));
            expect(result.current.completedLines).toHaveLength(0);
        });
    });

    describe("when shouldStart is false", () => {
        it("does not type any characters", async () => {
            const { result } = renderHook(() =>
                useTypewriter([{ text: "Hello" }], 50, false),
            );
            await act(async () => {
                vi.advanceTimersByTime(500);
            });
            expect(result.current.currentText).toBe("");
        });
    });

    describe("typing progression", () => {
        async function advanceUntil(predicate: () => boolean, maxIterations = 50) {
            for (let i = 0; i < maxIterations; i++) {
                if (predicate()) { break; }
                await act(async () => {
                    vi.advanceTimersByTime(20);
                });
            }
        }

        it("types at least one character after advancing timers", async () => {
            const { result } = renderHook(() =>
                useTypewriter([{ text: "AB" }], 10, true),
            );
            await advanceUntil(() => result.current.currentText.length > 0);
            expect(result.current.currentText.length).toBeGreaterThan(0);
        });

        it("marks the hook as complete after all lines are typed", async () => {
            const { result } = renderHook(() =>
                useTypewriter([{ text: "Hi" }], 10, true),
            );
            await advanceUntil(() => result.current.isComplete);
            expect(result.current.isComplete).toBe(true);
        });

        it("moves completed lines into completedLines after a line finishes", async () => {
            const { result } = renderHook(() =>
                useTypewriter([{ text: "Hi" }, { text: "Bye" }], 10, true),
            );
            await advanceUntil(() => result.current.completedLines.length >= 1);
            expect(result.current.completedLines.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe("with line delay", () => {
        it("does not start typing immediately when delay is set", () => {
            const { result } = renderHook(() =>
                useTypewriter([{ text: "A", delay: 500 }], 50, true),
            );

            expect(result.current.currentText).toBe("");
        });

        it("types text after delay has passed", async () => {
            const { result } = renderHook(() =>
                useTypewriter([{ text: "A", delay: 200 }], 50, true),
            );
            for (let i = 0; i < 100; i++) {
                if (result.current.currentText.length > 0) { break; }
                await act(async () => {
                    vi.advanceTimersByTime(20);
                });
            }
            expect(result.current.currentText.length).toBeGreaterThan(0);
        });
    });

    describe("when lines array is empty", () => {
        it("is immediately complete", () => {
            const { result } = renderHook(() => useTypewriter([]));
            expect(result.current.isComplete).toBe(true);
        });
    });
});
