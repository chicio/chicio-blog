import { useSyncExternalStore } from "react";

export type OsModifierKey = "meta" | "ctrl";

const detectModifierKey = (): OsModifierKey | null => {
    if (typeof navigator === "undefined") {
        return null;
    }
    return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ? "meta" : "ctrl";
};

const modifierKey = detectModifierKey();

const subscribe = () => () => {};

const getSnapshot = (): OsModifierKey | null => modifierKey;

const getServerSnapshot = (): OsModifierKey | null => null;

export const useOsModifierKey = (): OsModifierKey | null => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
