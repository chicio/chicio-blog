"use client";

import { useEffect, useRef } from "react";
import { appendKonamiKey, matchesKonamiSequence } from "@/lib/easter-eggs/konami-sequence";
import { consumePendingSpoonActivation, spoonActivationEvent } from "@/lib/easter-eggs/spoon-activation";
import { triggerEasterEgg } from "@/lib/easter-eggs/trigger-easter-egg";

export const useEasterEggTriggersStore = (): void => {
    const konamiBufferRef = useRef<string[]>([]);
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

};
