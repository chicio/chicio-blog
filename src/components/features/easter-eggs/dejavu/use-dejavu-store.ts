"use client";

import { useCallback, useEffect, useState } from "react";
import { isHeaderClickSequenceComplete } from "@/lib/easter-eggs/header-click-sequence";
import { triggerEasterEgg } from "@/lib/easter-eggs/trigger-easter-egg";
import type { EffectsStore } from "@/types/component-store";

const GLITCH_DURATION_MS = 400;

interface DejavuEffects {
    handleLogoClick: () => void;
}

export const useDejavuStore = (): EffectsStore<DejavuEffects> => {
    const [logoClicks, setLogoClicks] = useState(0);

    useEffect(() => {
        if (!isHeaderClickSequenceComplete(logoClicks)) {
            return;
        }

        document.body.classList.add("glitch-active");
        const glitchTimeout = setTimeout(() => {
            document.body.classList.remove("glitch-active");
            triggerEasterEgg("deja-vu");
            setLogoClicks(0);
        }, GLITCH_DURATION_MS);

        return () => {
            clearTimeout(glitchTimeout);
            document.body.classList.remove("glitch-active");
        };
    }, [logoClicks]);

    const handleLogoClick = useCallback(() => {
        setLogoClicks((prev) => (isHeaderClickSequenceComplete(prev) ? prev : prev + 1));
    }, []);

    return { effects: { handleLogoClick } };
};
