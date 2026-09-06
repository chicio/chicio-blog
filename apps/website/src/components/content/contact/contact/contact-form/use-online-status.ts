import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") {
        return () => {};
    }
    window.addEventListener("online", callback);
    window.addEventListener("offline", callback);
    return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
    };
};

const getSnapshot = (): boolean => !navigator.onLine;

const getServerSnapshot = (): boolean => false;

export const useIsOffline = (): boolean => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
