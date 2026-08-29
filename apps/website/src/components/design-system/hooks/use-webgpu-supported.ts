import { useSyncExternalStore } from "react";
import { isWebGPUSupported } from "matrix-rain-webgpu";

const detectWebGpuSupported = (): boolean | null => {
    if (typeof navigator === "undefined") {
        return null;
    }
    return isWebGPUSupported();
};

const webGpuSupported = detectWebGpuSupported();

const subscribe = () => () => {};

const getSnapshot = (): boolean | null => webGpuSupported;

const getServerSnapshot = (): boolean | null => null;

export const useWebGpuSupported = (): boolean | null => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
