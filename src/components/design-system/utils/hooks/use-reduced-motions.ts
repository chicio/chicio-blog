import { useEffect, useState } from "react";
import { useMotionStore } from "./use-motion-store";

interface NavigatorWithDevice extends Navigator {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
}

export function useReducedMotions() {
    const motionEnabled = useMotionStore();
    const [lowEndDevice, setLowEndDevice] = useState(false);

    useEffect(() => {
        const nav = navigator as NavigatorWithDevice;
        const memory = nav.deviceMemory ?? 4;
        const cores = nav.hardwareConcurrency ?? 4;
        const saveData = nav.connection?.saveData ?? false;
        const isLow = memory <= 2 || cores <= 2 || saveData;

        setLowEndDevice(isLow);
    }, []);

    const shouldReduceMotion = !motionEnabled || lowEndDevice;

    return shouldReduceMotion;
}