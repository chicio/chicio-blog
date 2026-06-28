import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { MatrixRainSettings } from "@/components/design-system/state/matrix-rain/matrix-settings";

const DEFAULTS: MatrixRainSettings = {
    version: 1,
    rain: { density: 0.95, stepRate: 10, fontSize: 20 },
    bloom: { enabled: true, intensity: 1.5, threshold: 0.8, emission: 1.1 },
    crt: { enabled: true, scanlineStrength: 0.3, aberration: 1.0 },
};

const readMatrixSettingsMock = vi.hoisted(() =>
    vi.fn((): MatrixRainSettings => ({
        version: 1,
        rain: { density: 0.95, stepRate: 10, fontSize: 20 },
        bloom: { enabled: true, intensity: 1.5, threshold: 0.8, emission: 1.1 },
        crt: { enabled: true, scanlineStrength: 0.3, aberration: 1.0 },
    })),
);

vi.mock("@/components/design-system/state/matrix-rain/matrix-settings", () => ({
    MATRIX_RAIN_DEFAULTS: {
        version: 1,
        rain: { density: 0.95, stepRate: 10, fontSize: 20 },
        bloom: { enabled: true, intensity: 1.5, threshold: 0.8, emission: 1.1 },
        crt: { enabled: true, scanlineStrength: 0.3, aberration: 1.0 },
    },
    matrixSettingsChangeEvent: "matrix-settings-change",
    readMatrixSettings: readMatrixSettingsMock,
}));

import { useMatrixSettingsStore } from "./use-matrix-settings-store";

describe("useMatrixSettingsStore", () => {
    beforeEach(() => {
        readMatrixSettingsMock.mockReturnValue(DEFAULTS);
    });

    describe("getSnapshot", () => {
        it("returns default settings on initial render", () => {
            const { result } = renderHook(() => useMatrixSettingsStore());
            expect(result.current).toEqual(DEFAULTS);
        });

        it("returns updated settings after store changes", () => {
            const updated: MatrixRainSettings = { ...DEFAULTS, rain: { ...DEFAULTS.rain, fontSize: 14 } };
            readMatrixSettingsMock.mockReturnValue(updated);
            const { result } = renderHook(() => useMatrixSettingsStore());
            expect(result.current.rain.fontSize).toBe(14);
        });
    });

    describe("subscribe/re-render on matrix-settings-change event", () => {
        it("re-reads snapshot when event fires", async () => {
            readMatrixSettingsMock.mockReturnValue(DEFAULTS);
            const { result } = renderHook(() => useMatrixSettingsStore());
            expect(result.current.rain.fontSize).toBe(20);

            const updated: MatrixRainSettings = { ...DEFAULTS, rain: { ...DEFAULTS.rain, fontSize: 16 } };
            readMatrixSettingsMock.mockReturnValue(updated);

            await act(async () => {
                window.dispatchEvent(new Event("matrix-settings-change"));
            });

            expect(result.current.rain.fontSize).toBe(16);
        });
    });

    describe("unsubscribe on unmount", () => {
        it("no longer updates after unmount", async () => {
            readMatrixSettingsMock.mockReturnValue(DEFAULTS);
            const { result, unmount } = renderHook(() => useMatrixSettingsStore());
            unmount();

            const updated: MatrixRainSettings = { ...DEFAULTS, rain: { ...DEFAULTS.rain, fontSize: 12 } };
            readMatrixSettingsMock.mockReturnValue(updated);

            await act(async () => {
                window.dispatchEvent(new Event("matrix-settings-change"));
            });

            expect(result.current.rain.fontSize).toBe(20);
        });
    });
});
