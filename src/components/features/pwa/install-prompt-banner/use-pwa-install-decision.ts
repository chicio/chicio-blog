import { useSyncExternalStore } from "react";
import {
    PwaInstallDecision,
    pwaInstallDecisionChangeEvent,
    readPwaInstallDecision,
} from "@/lib/pwa/pwa-install-decision";

const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") {
        return () => {};
    }
    window.addEventListener(pwaInstallDecisionChangeEvent, callback);
    return () => {
        window.removeEventListener(pwaInstallDecisionChangeEvent, callback);
    };
};

const getSnapshot = (): PwaInstallDecision | null => readPwaInstallDecision();

const getServerSnapshot = (): PwaInstallDecision | null => null;

export const usePwaInstallDecision = (): PwaInstallDecision | null => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
