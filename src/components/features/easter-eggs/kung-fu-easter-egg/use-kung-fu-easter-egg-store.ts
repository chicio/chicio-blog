import { useCallback, useEffect, useRef, useState } from "react";
import { appendKonamiKey, matchesKonamiSequence } from "@/lib/easter-eggs/konami-sequence";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { ComponentStore } from "@/types/component-store";

interface KungFuEasterEggState {
    active: boolean;
}

interface KungFuEasterEggEffects {
    dismiss: () => void;
}

export const useKungFuEasterEggStore = (): ComponentStore<KungFuEasterEggState, KungFuEasterEggEffects> => {
    const [active, setActive] = useState(false);
    const bufferRef = useRef<string[]>([]);

    const dismiss = useCallback(() => {
        setActive(false);
    }, []);

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
                setActive(true);
                trackWith({
                    category: tracking.category.easter_egg_hunt,
                    label: "i_know_kung_fu",
                    action: tracking.action.easter_egg_konami,
                });
                const audio = new Audio("/media/sounds/i-know-kung-fu.mp3");
                audio.play().catch(() => {});
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [active, dismiss]);

    return {
        state: { active },
        effects: { dismiss },
    };
};
