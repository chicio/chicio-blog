import { readLocalStorage, writeLocalStorage } from "@/lib/local-storage/local-storage";
import { BloomOptions, CrtOptions, RainOptions } from "matrix-rain-webgpu";

const STORAGE_KEY = "matrix-rain-settings";
const SETTINGS_VERSION = 1;

interface MatrixRainBloomSettings {
    enabled: boolean;
    intensity: number;
    threshold: number;
    emission: number;
}

interface MatrixRainCrtSettings {
    enabled: boolean;
    scanlineStrength: number;
    aberration: number;
}

interface MatrixRainRainSettings {
    density: number;
    stepRate: number;
    fontSize: number;
}

export interface MatrixRainSettings {
    version: number;
    rain: MatrixRainRainSettings;
    bloom: MatrixRainBloomSettings;
    crt: MatrixRainCrtSettings;
}

export interface MatrixRainProps {
    rain: RainOptions;
    bloom: BloomOptions | false;
    crt: CrtOptions | false;
}

// TUNE TO TASTE: These defaults match the matrix-rain-webgpu package documented defaults.
// density 0.95, stepRate 10, fontSize 20, bloom intensity 1.5/threshold 0.8/emission 1.1,
// crt scanlineStrength 0.3/aberration 1.0 — all effects enabled.
export const MATRIX_RAIN_DEFAULTS: MatrixRainSettings = {
    version: SETTINGS_VERSION,
    rain: {
        density: 0.95,
        stepRate: 10,
        fontSize: 20,
    },
    bloom: {
        enabled: true,
        intensity: 1.5,
        threshold: 0.8,
        emission: 1.1,
    },
    crt: {
        enabled: true,
        scanlineStrength: 0.3,
        aberration: 1.0,
    },
};

export const MATRIX_RAIN_PRESETS: Record<string, MatrixRainSettings> = {
    Classic: MATRIX_RAIN_DEFAULTS,
    Cyberpunk: {
        version: SETTINGS_VERSION,
        rain: { density: 0.90, stepRate: 14, fontSize: 16 },
        bloom: { enabled: true, intensity: 2.8, threshold: 0.5, emission: 2.0 },
        crt: { enabled: true, scanlineStrength: 0.4, aberration: 2.8 },
    },
    Overload: {
        version: SETTINGS_VERSION,
        rain: { density: 0.82, stepRate: 28, fontSize: 12 },
        bloom: { enabled: true, intensity: 3.0, threshold: 0.3, emission: 2.5 },
        crt: { enabled: true, scanlineStrength: 0.8, aberration: 2.0 },
    },
};

export const matrixSettingsChangeEvent = "matrix-settings-change";

let cachedRaw: string | null = null;
let cachedSnapshot: MatrixRainSettings = MATRIX_RAIN_DEFAULTS;

export const readMatrixSettings = (): MatrixRainSettings => {
    let raw: string | null;
    try {
        raw = readLocalStorage(STORAGE_KEY);
    } catch {
        return MATRIX_RAIN_DEFAULTS;
    }
    if (raw === null) {
        cachedRaw = null;
        cachedSnapshot = MATRIX_RAIN_DEFAULTS;
        return cachedSnapshot;
    }
    if (raw === cachedRaw) {
        return cachedSnapshot;
    }
    try {
        const parsed = JSON.parse(raw) as MatrixRainSettings;
        cachedRaw = raw;
        cachedSnapshot = parsed.version === SETTINGS_VERSION ? parsed : MATRIX_RAIN_DEFAULTS;
        return cachedSnapshot;
    } catch {
        return MATRIX_RAIN_DEFAULTS;
    }
};

export const writeMatrixSettings = (settings: MatrixRainSettings): void => {
    writeLocalStorage(STORAGE_KEY, JSON.stringify({ ...settings, version: SETTINGS_VERSION }));
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(matrixSettingsChangeEvent));
    }
};

export const settingsToProps = (settings: MatrixRainSettings): MatrixRainProps => ({
    rain: {
        density: settings.rain.density,
        stepRate: settings.rain.stepRate,
        fontSize: settings.rain.fontSize,
    },
    bloom: settings.bloom.enabled
        ? {
              intensity: settings.bloom.intensity,
              threshold: settings.bloom.threshold,
              emission: settings.bloom.emission,
          }
        : false,
    crt: settings.crt.enabled
        ? {
              scanlineStrength: settings.crt.scanlineStrength,
              aberration: settings.crt.aberration,
          }
        : false,
});
