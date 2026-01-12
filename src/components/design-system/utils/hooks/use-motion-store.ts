import { useSyncExternalStore } from "react";
import { hasMotion, motionChangeEvent } from "@/lib/motion/motion";

const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") { 
        return () => {};
    }

    const handleMotionChange = () => {
        callback();
    };

    window.addEventListener(motionChangeEvent, handleMotionChange);

    return () => {
        window.removeEventListener(motionChangeEvent, handleMotionChange);
    };
};

const getSnapshot = () => hasMotion();

const getServerSnapshot = () => true; // Default to animations enabled on server

/**
 * React hook to subscribe to motion settings using useSyncExternalStore.
 * Returns true if animations are enabled, false otherwise.
 *
 * Behavior:
 * - Current tab: Changes sync immediately via custom events
 * - New tabs: Automatically read from localStorage on mount
 * - SSR: Defaults to enabled to prevent hydration mismatches
 */
export const useMotionStore = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
