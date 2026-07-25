import { useEffect, useState } from "react";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import { spoonActivationEvent } from "@/lib/easter-eggs/spoon-activation";
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

    useEffect(() => {
        const handleActivation = () => {
            if (phase !== "idle") {
                return;
            }

            trackWith({
                category: tracking.category.easter_egg_hunt,
                label: "there_is_no_spoon",
                action: tracking.action.easter_egg_spoon,
            });
            setPhase(reducedMotion ? "warping" : "glitching");
        };

        window.addEventListener(spoonActivationEvent, handleActivation);
        return () => {
            window.removeEventListener(spoonActivationEvent, handleActivation);
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
