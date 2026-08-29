"use client";

import { useCallback, useEffect, useRef } from "react";
import { isTapSequenceComplete, TAP_RESET_WINDOW_MS } from "@/lib/easter-eggs/fighting-genre";
import { triggerEasterEgg } from "@/lib/easter-eggs/trigger-easter-egg";
import type { EffectsStore } from "@/types/component-store";

interface FightingGameTriggerEffects {
    registerTap: () => void;
}

export const useFightingGameTriggerStore = (): EffectsStore<FightingGameTriggerEffects> => {
    const tapCountRef = useRef(0);
    const tapResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

        if (isTapSequenceComplete(tapCountRef.current)) {
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
