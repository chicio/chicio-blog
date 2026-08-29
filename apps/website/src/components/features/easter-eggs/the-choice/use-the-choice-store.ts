"use client";

import { useCallback, useRef } from "react";
import { isHeaderClickSequenceComplete } from "@/lib/easter-eggs/header-click-sequence";
import { triggerEasterEgg } from "@/lib/easter-eggs/trigger-easter-egg";
import type { EffectsStore } from "matrix-component-store";

interface TheChoiceEffects {
    handleLogoClick: () => void;
}

/**
 * Opens straight into the overlay. This trigger used to shake the whole page for 400ms first, left
 * over from when the egg was a still image and needed something to announce itself. Every egg now
 * opens the same way, as a fade, so the shake was both the odd one out and a delay in front of it.
 *
 * With the shake gone there is no longer anything to render between the fourth click and the overlay,
 * so the tally lives in a ref and the whole thing happens in the event handler. Keeping it in state
 * would mean opening the egg from an effect, which is the wrong place for a side effect and is what
 * `react-hooks/set-state-in-effect` objects to.
 */
export const useTheChoiceStore = (): EffectsStore<TheChoiceEffects> => {
    const logoClicksRef = useRef(0);

    const handleLogoClick = useCallback(() => {
        logoClicksRef.current += 1;

        if (isHeaderClickSequenceComplete(logoClicksRef.current)) {
            logoClicksRef.current = 0;
            triggerEasterEgg("the-choice");
        }
    }, []);

    return { effects: { handleLogoClick } };
};
