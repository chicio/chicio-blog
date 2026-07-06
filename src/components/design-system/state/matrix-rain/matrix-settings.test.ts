import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    readMatrixSettings,
    writeMatrixSettings,
    settingsToProps,
    matrixSettingsChangeEvent,
    MATRIX_RAIN_DEFAULTS,
    MatrixRainSettings,
} from "./matrix-settings";

const STORAGE_KEY = "fabrizioduroni_matrix-rain-settings";

describe("matrix-settings", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("readMatrixSettings", () => {
        it("returns the defaults when nothing is stored", () => {
            expect(readMatrixSettings()).toEqual(MATRIX_RAIN_DEFAULTS);
        });

        it("returns the SAME object reference across consecutive calls with identical raw storage", () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(MATRIX_RAIN_DEFAULTS));
            expect(readMatrixSettings()).toBe(readMatrixSettings());
        });

        it("returns the defaults when the stored version does not match the current version", () => {
            const stale: MatrixRainSettings = {
                ...MATRIX_RAIN_DEFAULTS,
                version: 999,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stale));
            expect(readMatrixSettings()).toEqual(MATRIX_RAIN_DEFAULTS);
        });

        it("returns the defaults without throwing when the stored value is malformed JSON", () => {
            localStorage.setItem(STORAGE_KEY, "{not-valid-json");
            expect(() => readMatrixSettings()).not.toThrow();
            expect(readMatrixSettings()).toEqual(MATRIX_RAIN_DEFAULTS);
        });

        it("reflects a fresh value after the stored raw changes", () => {
            const custom: MatrixRainSettings = {
                version: MATRIX_RAIN_DEFAULTS.version,
                rain: { density: 0.5, stepRate: 5, fontSize: 10 },
                bloom: { enabled: false, intensity: 0, threshold: 0, emission: 0 },
                crt: { enabled: false, scanlineStrength: 0, aberration: 0 },
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
            expect(readMatrixSettings()).toEqual(custom);
        });
    });

    describe("writeMatrixSettings", () => {
        it("persists the settings stamped with the current version", () => {
            const custom: MatrixRainSettings = {
                version: MATRIX_RAIN_DEFAULTS.version,
                rain: { density: 0.7, stepRate: 12, fontSize: 18 },
                bloom: { enabled: false, intensity: 1, threshold: 1, emission: 1 },
                crt: { enabled: true, scanlineStrength: 0.5, aberration: 0.5 },
            };
            writeMatrixSettings(custom);
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) as string) as MatrixRainSettings;
            expect(stored).toEqual(custom);
        });

        it("dispatches the matrix settings change event", () => {
            const listener = vi.fn();
            window.addEventListener(matrixSettingsChangeEvent, listener);
            writeMatrixSettings(MATRIX_RAIN_DEFAULTS);
            window.removeEventListener(matrixSettingsChangeEvent, listener);
            expect(listener).toHaveBeenCalledOnce();
        });

        it("round-trips: a written value is reflected by a subsequent read", () => {
            const custom: MatrixRainSettings = {
                version: MATRIX_RAIN_DEFAULTS.version,
                rain: { density: 0.6, stepRate: 20, fontSize: 14 },
                bloom: { enabled: true, intensity: 2, threshold: 0.4, emission: 0.9 },
                crt: { enabled: false, scanlineStrength: 0.1, aberration: 0.2 },
            };
            writeMatrixSettings(custom);
            expect(readMatrixSettings()).toEqual(custom);
        });
    });

    describe("settingsToProps", () => {
        it("maps bloom and crt to their options objects when both are enabled", () => {
            const settings: MatrixRainSettings = {
                version: MATRIX_RAIN_DEFAULTS.version,
                rain: { density: 0.95, stepRate: 10, fontSize: 20 },
                bloom: { enabled: true, intensity: 1.5, threshold: 0.8, emission: 1.1 },
                crt: { enabled: true, scanlineStrength: 0.3, aberration: 1.0 },
            };
            expect(settingsToProps(settings)).toEqual({
                rain: { density: 0.95, stepRate: 10, fontSize: 20 },
                bloom: { intensity: 1.5, threshold: 0.8, emission: 1.1 },
                crt: { scanlineStrength: 0.3, aberration: 1.0 },
            });
        });

        it("maps bloom and crt to false when both are disabled", () => {
            const settings: MatrixRainSettings = {
                version: MATRIX_RAIN_DEFAULTS.version,
                rain: { density: 0.5, stepRate: 8, fontSize: 16 },
                bloom: { enabled: false, intensity: 1.5, threshold: 0.8, emission: 1.1 },
                crt: { enabled: false, scanlineStrength: 0.3, aberration: 1.0 },
            };
            expect(settingsToProps(settings)).toEqual({
                rain: { density: 0.5, stepRate: 8, fontSize: 16 },
                bloom: false,
                crt: false,
            });
        });
    });
});
