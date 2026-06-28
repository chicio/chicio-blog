import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGlassmorphism } from "./use-glassmorphism";

vi.mock("./use-reduced-motions", () => ({
    useReducedMotions: vi.fn(),
}));

import { useReducedMotions } from "./use-reduced-motions";

const mockUseReducedMotions = vi.mocked(useReducedMotions);

describe("useGlassmorphism", () => {
    describe("when motion is enabled (no reduced motion)", () => {
        it("returns glassmorphism class", () => {
            mockUseReducedMotions.mockReturnValue(false);
            const { result } = renderHook(() => useGlassmorphism());
            expect(result.current.glassmorphismClass).toContain("glassmorphism");
            expect(result.current.glassmorphismClass).not.toContain("glassmorphism-lite");
        });

        it("returns glassmorphism-no-scale when noScale is true", () => {
            mockUseReducedMotions.mockReturnValue(false);
            const { result } = renderHook(() => useGlassmorphism({ noScale: true }));
            expect(result.current.glassmorphismClass).toContain("glassmorphism-no-scale");
        });

        it("includes backdrop-blur-2xl! when increaseContrast is true", () => {
            mockUseReducedMotions.mockReturnValue(false);
            const { result } = renderHook(() => useGlassmorphism({ increaseContrast: true }));
            expect(result.current.glassmorphismClass).toContain("backdrop-blur-2xl!");
        });
    });

    describe("when motion is reduced", () => {
        it("returns glassmorphism-lite class", () => {
            mockUseReducedMotions.mockReturnValue(true);
            const { result } = renderHook(() => useGlassmorphism());
            expect(result.current.glassmorphismClass).toContain("glassmorphism-lite");
        });

        it("returns glassmorphism-lite-no-scale when noScale is true", () => {
            mockUseReducedMotions.mockReturnValue(true);
            const { result } = renderHook(() => useGlassmorphism({ noScale: true }));
            expect(result.current.glassmorphismClass).toContain("glassmorphism-lite-no-scale");
        });

        it("includes backdrop-blur-2xl! when increaseContrast is true", () => {
            mockUseReducedMotions.mockReturnValue(true);
            const { result } = renderHook(() => useGlassmorphism({ increaseContrast: true }));
            expect(result.current.glassmorphismClass).toContain("backdrop-blur-2xl!");
        });
    });
});
