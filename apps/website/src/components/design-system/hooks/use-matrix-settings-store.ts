import { useSyncExternalStore } from "react";
import {
    MATRIX_RAIN_DEFAULTS,
    matrixSettingsChangeEvent,
    readMatrixSettings,
} from "@/components/design-system/state/matrix-rain/matrix-settings";
import type { MatrixRainSettings } from "@/components/design-system/state/matrix-rain/matrix-settings";

const subscribe = (callback: () => void): (() => void) => {
    if (typeof window === "undefined") {
        return () => {};
    }

    window.addEventListener(matrixSettingsChangeEvent, callback);
    return () => window.removeEventListener(matrixSettingsChangeEvent, callback);
};

const getSnapshot = (): MatrixRainSettings => readMatrixSettings();

const getServerSnapshot = (): MatrixRainSettings => MATRIX_RAIN_DEFAULTS;

export const useMatrixSettingsStore = (): MatrixRainSettings => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
