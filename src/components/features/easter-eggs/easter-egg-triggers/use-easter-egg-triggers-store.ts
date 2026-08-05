"use client";

import { useCallback, useEffect, useRef } from "react";
import { appendKonamiKey, matchesKonamiSequence } from "@/lib/easter-eggs/konami-sequence";
import { consumePendingSpoonActivation, spoonActivationEvent } from "@/lib/easter-eggs/spoon-activation";
import { triggerEasterEgg } from "@/lib/easter-eggs/trigger-easter-egg";
import type { EffectsStore } from "@/types/component-store";

const TAP_TRIGGER_COUNT = 5;
const TAP_RESET_WINDOW_MS = 1500;

interface EasterEggTriggersEffects {
    registerTap: () => void;
}

export const useEasterEggTriggersStore = (): EffectsStore<EasterEggTriggersEffects> => {
    const konamiBufferRef = useRef<string[]>([]);
    const tapCountRef = useRef(0);
    const tapResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasDrainedPendingSpoonActivation = useRef(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            konamiBufferRef.current = appendKonamiKey(konamiBufferRef.current, event.key);

            if (matchesKonamiSequence(konamiBufferRef.current)) {
                konamiBufferRef.current = [];
                triggerEasterEgg("i-know-kung-fu");
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        const handleSpoonActivation = () => {
            consumePendingSpoonActivation();
            triggerEasterEgg("there-is-no-spoon");
        };

        window.addEventListener(spoonActivationEvent, handleSpoonActivation);

        if (!hasDrainedPendingSpoonActivation.current) {
            hasDrainedPendingSpoonActivation.current = true;

            if (consumePendingSpoonActivation()) {
                triggerEasterEgg("there-is-no-spoon");
            }
        }

        return () => window.removeEventListener(spoonActivationEvent, handleSpoonActivation);
    }, []);

    useEffect(() => {
        return () => {
            if (tapResetTimeoutRef.current) {
                clearTimeout(tapResetTimeoutRef.current);
            }
        };
    }, []);

    const registerTap = useCallback(() => {
        if (tapResetTimeoutRef.current) {
            clearTimeout(tapResetTimeoutRef.current);
            tapResetTimeoutRef.current = null;
        }

        tapCountRef.current += 1;

        if (tapCountRef.current >= TAP_TRIGGER_COUNT) {
            tapCountRef.current = 0;
            triggerEasterEgg("i-know-kung-fu");
            return;
        }

        tapResetTimeoutRef.current = setTimeout(() => {
            tapCountRef.current = 0;
            tapResetTimeoutRef.current = null;
        }, TAP_RESET_WINDOW_MS);
    }, []);

    return { effects: { registerTap } };
};
