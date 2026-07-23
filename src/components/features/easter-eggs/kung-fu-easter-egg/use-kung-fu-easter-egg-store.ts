import { useCallback, useEffect, useRef, useState } from "react";
import { appendKonamiKey, matchesKonamiSequence } from "@/lib/easter-eggs/konami-sequence";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { ComponentStore } from "@/types/component-store";

const TAP_TRIGGER_COUNT = 5;
const TAP_RESET_WINDOW_MS = 1500;

interface KungFuEasterEggState {
    active: boolean;
}

interface KungFuEasterEggEffects {
    dismiss: () => void;
    registerTap: () => void;
}

export const useKungFuEasterEggStore = (): ComponentStore<KungFuEasterEggState, KungFuEasterEggEffects> => {
    const [active, setActive] = useState(false);
    const [tapCount, setTapCount] = useState(0);
    const bufferRef = useRef<string[]>([]);

    const dismiss = useCallback(() => {
        setActive(false);
    }, []);

    const activate = useCallback(() => {
        if (active) {
            return;
        }

        setActive(true);
        trackWith({
            category: tracking.category.easter_egg_hunt,
            label: "i_know_kung_fu",
            action: tracking.action.easter_egg_kung_fu,
        });
        const audio = new Audio("/media/sounds/i-know-kung-fu.mp3");
        audio.play().catch(() => {});
    }, [active]);

    const registerTap = useCallback(() => {
        if (active) {
            return;
        }

        setTapCount((current) => current + 1);
    }, [active]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (active) {
                if (event.key === "Escape") {
                    dismiss();
                }
                return;
            }

            bufferRef.current = appendKonamiKey(bufferRef.current, event.key);

            if (matchesKonamiSequence(bufferRef.current)) {
                bufferRef.current = [];
                activate();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [active, dismiss, activate]);

    useEffect(() => {
        if (tapCount === 0) {
            return;
        }

        if (tapCount >= TAP_TRIGGER_COUNT) {
            setTapCount(0);
            activate();
            return;
        }

        const resetTimeout = setTimeout(() => {
            setTapCount(0);
        }, TAP_RESET_WINDOW_MS);

        return () => {
            clearTimeout(resetTimeout);
        };
    }, [tapCount, activate]);

    return {
        state: { active },
        effects: { dismiss, registerTap },
    };
};
