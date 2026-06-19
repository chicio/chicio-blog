import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

const getSnapshot = () => !!navigator.clipboard;

const getServerSnapshot = () => false;

export const useClipboardAvailable = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
