"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import type { StateStore } from "@/types/component-store";

const GISCUS_ORIGIN = "https://giscus.app";
const MAX_SIMULATED_PERCENTAGE = 90;
const TICK_INTERVAL_MS = 350;
const COMPLETE_BEAT_MS = 400;
const FALLBACK_TIMEOUT_MS = 12000;

interface BlogCommentsState {
    percentage: number;
    isLoaded: boolean;
    shouldReduceMotion: boolean;
}

/**
 * Drives a simulated terminal-style progress bar while the giscus iframe loads.
 * giscus never reports its own loading progress, so the percentage ticks up
 * asymptotically towards 90% until a `postMessage` from https://giscus.app
 * confirms the widget is alive, at which point it completes to 100%. A 12s
 * fallback timeout guards against an offline/errored giscus leaving the bar
 * stuck forever.
 */
export const useBlogCommentsStore = (): StateStore<BlogCommentsState> => {
    const shouldReduceMotion = useReducedMotions();
    const [percentage, setPercentage] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const hasCompletedRef = useRef(false);
    const completionBeatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const tickInterval = setInterval(() => {
            setPercentage((current) => {
                const increment = Math.max((MAX_SIMULATED_PERCENTAGE - current) * 0.15, 0.5);
                return Math.min(MAX_SIMULATED_PERCENTAGE, current + increment);
            });
        }, TICK_INTERVAL_MS);

        const completeLoading = () => {
            if (hasCompletedRef.current) {
                return;
            }
            hasCompletedRef.current = true;
            clearInterval(tickInterval);
            clearTimeout(fallbackTimeout);
            setPercentage(100);

            if (shouldReduceMotion) {
                setIsLoaded(true);
                return;
            }

            completionBeatTimeoutRef.current = setTimeout(() => setIsLoaded(true), COMPLETE_BEAT_MS);
        };

        const handleGiscusMessage = (event: MessageEvent) => {
            if (event.origin === GISCUS_ORIGIN) {
                completeLoading();
            }
        };

        window.addEventListener("message", handleGiscusMessage);

        const fallbackTimeout = setTimeout(completeLoading, FALLBACK_TIMEOUT_MS);

        return () => {
            clearInterval(tickInterval);
            clearTimeout(fallbackTimeout);
            if (completionBeatTimeoutRef.current) {
                clearTimeout(completionBeatTimeoutRef.current);
            }
            window.removeEventListener("message", handleGiscusMessage);
        };
    }, [shouldReduceMotion]);

    return {
        state: { percentage, isLoaded, shouldReduceMotion },
    };
};
