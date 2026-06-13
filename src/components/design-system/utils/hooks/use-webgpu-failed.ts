import { useSyncExternalStore } from "react";

const webGpuFailedChangeEvent = "webgpu-failed-change";

let failed = false;
const listeners = new Set<() => void>();

const subscribe = (callback: () => void): (() => void) => {
    listeners.add(callback);
    if (typeof window !== "undefined") {
        window.addEventListener(webGpuFailedChangeEvent, callback);
    }
    return () => {
        listeners.delete(callback);
        if (typeof window !== "undefined") {
            window.removeEventListener(webGpuFailedChangeEvent, callback);
        }
    };
};

const getSnapshot = (): boolean => failed;
const getServerSnapshot = (): boolean => false;

export const setWebGpuFailed = (): void => {
    failed = true;
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(webGpuFailedChangeEvent));
    }
};

export const useWebGpuFailed = (): boolean => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
