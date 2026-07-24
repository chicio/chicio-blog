import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { appendKonamiKey, matchesKonamiSequence } from "@/lib/easter-eggs/konami-sequence";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { ComponentStore } from "@/types/component-store";

const TAP_TRIGGER_COUNT = 5;
const TAP_RESET_WINDOW_MS = 1500;

interface KungFuEasterEggState {
    active: boolean;
    isCompleted: boolean;
}

interface KungFuEasterEggEffects {
    dismiss: () => void;
    registerTap: () => void;
    onComplete: () => void;
    replay: () => void;
    stopClick: (event: MouseEvent<HTMLDivElement>) => void;
    setVideoEl: (el: HTMLVideoElement | null) => void;
}

export const useKungFuEasterEggStore = (): ComponentStore<KungFuEasterEggState, KungFuEasterEggEffects> => {
    const [active, setActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const videoElRef = useRef<HTMLVideoElement | null>(null);
    const bufferRef = useRef<string[]>([]);
    const tapCountRef = useRef(0);
    const tapResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setVideoEl = useCallback((el: HTMLVideoElement | null) => {
        videoElRef.current = el;
    }, []);

    const dismiss = useCallback(() => {
        setActive(false);
        setIsCompleted(false);
    }, []);

    const onComplete = useCallback(() => {
        setIsCompleted(true);
    }, []);

    const replay = useCallback(() => {
        const videoEl = videoElRef.current;
        if (videoEl) {
            videoEl.currentTime = 0;
            videoEl.play().catch(() => {});
        }
    }, []);

    const stopClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    }, []);

    const activate = useCallback(() => {
        if (active) {
            return;
        }

        setActive(true);
        setIsCompleted(false);
        trackWith({
            category: tracking.category.easter_egg_hunt,
            label: "i_know_kung_fu",
            action: tracking.action.easter_egg_kung_fu,
        });
    }, [active]);

    const registerTap = useCallback(() => {
        if (active) {
            return;
        }

        if (tapResetTimeoutRef.current) {
            clearTimeout(tapResetTimeoutRef.current);
            tapResetTimeoutRef.current = null;
        }

        tapCountRef.current += 1;

        if (tapCountRef.current >= TAP_TRIGGER_COUNT) {
            tapCountRef.current = 0;
            activate();
            return;
        }

        tapResetTimeoutRef.current = setTimeout(() => {
            tapCountRef.current = 0;
            tapResetTimeoutRef.current = null;
        }, TAP_RESET_WINDOW_MS);
    }, [active, activate]);

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
        return () => {
            if (tapResetTimeoutRef.current) {
                clearTimeout(tapResetTimeoutRef.current);
            }
        };
    }, []);

    return {
        state: { active, isCompleted },
        effects: { dismiss, registerTap, onComplete, replay, stopClick, setVideoEl },
    };
};
