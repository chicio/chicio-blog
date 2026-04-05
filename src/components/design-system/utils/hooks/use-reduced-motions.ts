import { useMotionStore } from "./use-motion-store";
import { useDeviceCapabilities } from "./use-device-capabilities";

export function useReducedMotions() {
    const motionEnabled = useMotionStore();
    const { isLowEnd } = useDeviceCapabilities();

    return !motionEnabled || isLowEnd;
}
