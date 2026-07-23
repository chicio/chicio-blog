import { useEffect, useRef, useState } from "react";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import { shouldIgnoreKeystroke } from "@/lib/easter-eggs/input-focus-guard";
import { appendToSpoonPhraseBuffer, matchesSpoonPhrase } from "@/lib/easter-eggs/spoon-phrase-buffer";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { StateStore } from "@/types/component-store";

type SpoonEasterEggPhase = "idle" | "glitching" | "warping";

const GLITCH_DURATION_MS = 400;
const WARP_DURATION_MS = 5600;

interface SpoonEasterEggState {
    warping: boolean;
    reducedMotion: boolean;
}

export const useSpoonEasterEggStore = (): StateStore<SpoonEasterEggState> => {
    const reducedMotion = useReducedMotions();
    const [phase, setPhase] = useState<SpoonEasterEggPhase>("idle");
    const bufferRef = useRef("");

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (phase !== "idle") {
                return;
            }

            if (shouldIgnoreKeystroke(document.activeElement)) {
                return;
            }

            bufferRef.current = appendToSpoonPhraseBuffer(bufferRef.current, event.key);

            if (matchesSpoonPhrase(bufferRef.current)) {
                bufferRef.current = "";
                trackWith({
                    category: tracking.category.easter_egg_hunt,
                    label: "there_is_no_spoon",
                    action: tracking.action.easter_egg_spoon,
                });
                setPhase(reducedMotion ? "warping" : "glitching");
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [phase, reducedMotion]);

    useEffect(() => {
        if (phase === "glitching") {
            document.body.classList.add("glitch-active");
            const glitchTimeout = setTimeout(() => {
                document.body.classList.remove("glitch-active");
                setPhase("warping");
            }, GLITCH_DURATION_MS);
            return () => {
                clearTimeout(glitchTimeout);
                document.body.classList.remove("glitch-active");
            };
        }

        if (phase === "warping") {
            const resetTimeout = setTimeout(() => setPhase("idle"), WARP_DURATION_MS);
            return () => clearTimeout(resetTimeout);
        }
    }, [phase]);

    return {
        state: { warping: phase === "warping", reducedMotion },
    };
};
