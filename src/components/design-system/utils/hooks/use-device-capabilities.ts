import { useSyncExternalStore } from "react";

interface NavigatorWithDevice extends Navigator {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
}

interface DeviceCapabilities {
    deviceMemory: number | undefined;
    cores: number;
    saveData: boolean;
    isLowEnd: boolean;
}

const defaults: DeviceCapabilities = {
    deviceMemory: undefined,
    cores: 4,
    saveData: false,
    isLowEnd: false,
};

const computeCapabilities = (): DeviceCapabilities => {
    if (typeof navigator === "undefined") {
        return defaults;
    }
    const nav = navigator as NavigatorWithDevice;
    const deviceMemory = nav.deviceMemory;
    const cores = nav.hardwareConcurrency ?? 4;
    const saveData = nav.connection?.saveData ?? false;
    const isLowEnd = (deviceMemory != null && deviceMemory <= 2) || cores <= 2 || saveData;
    
    return { deviceMemory, cores, saveData, isLowEnd };
};

const capabilities = computeCapabilities();

const subscribe = () => () => {};

const getSnapshot = (): DeviceCapabilities => capabilities;

const getServerSnapshot = (): DeviceCapabilities => defaults;

export function useDeviceCapabilities(): DeviceCapabilities {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
