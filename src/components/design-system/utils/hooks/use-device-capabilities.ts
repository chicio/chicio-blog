import { useEffect, useState } from "react";

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

export function useDeviceCapabilities(): DeviceCapabilities {
    const [capabilities, setCapabilities] = useState<DeviceCapabilities>(defaults);

    useEffect(() => {
        const nav = navigator as NavigatorWithDevice;
        const deviceMemory = nav.deviceMemory;
        const cores = nav.hardwareConcurrency ?? 4;
        const saveData = nav.connection?.saveData ?? false;
        const isLowEnd = (deviceMemory != null && deviceMemory <= 2) || cores <= 2 || saveData;

        setCapabilities({ deviceMemory, cores, saveData, isLowEnd });
    }, []);

    return capabilities;
}
