"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { useReducedMotions } from "matrix-design-system";
import { EASTER_EGG_CATALOG, type EasterEggCatalogEntry } from "@/lib/easter-eggs/easter-egg-catalog";
import {
    closeEasterEgg,
    getEasterEggOverlaySlug,
    subscribeToEasterEggOverlay,
} from "@/lib/easter-eggs/easter-egg-overlay-state";
import type { ComponentStore } from "matrix-component-store";

const getServerSlugSnapshot = (): null => null;

interface EasterEggOverlayState {
    entry: EasterEggCatalogEntry | null;
    bootComplete: boolean;
    reducedMotion: boolean;
    skipSignal: number;
}

interface EasterEggOverlayEffects {
    close: () => void;
    handleCardClick: (event: MouseEvent) => void;
    handleBootComplete: () => void;
    setContainerEl: (el: HTMLDivElement | null) => void;
    setVideoEl: (el: HTMLVideoElement | null) => void;
}

export const useEasterEggOverlayStore = (): ComponentStore<EasterEggOverlayState, EasterEggOverlayEffects> => {
    const slug = useSyncExternalStore(subscribeToEasterEggOverlay, getEasterEggOverlaySlug, getServerSlugSnapshot);
    const reducedMotion = useReducedMotions();
    const [bootComplete, setBootComplete] = useState(false);
    const [skipSignal, setSkipSignal] = useState(0);
    const [previousEntry, setPreviousEntry] = useState<EasterEggCatalogEntry | null>(null);
    const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
    const triggerElRef = useRef<HTMLElement | null>(null);
    const videoElRef = useRef<HTMLVideoElement | null>(null);
    const hasResetPlaybackRef = useRef(false);

    const setVideoEl = useCallback((el: HTMLVideoElement | null) => {
        videoElRef.current = el;
    }, []);

    const entry = slug ? EASTER_EGG_CATALOG[slug] : null;

    if (previousEntry !== entry) {
        setPreviousEntry(entry);

        if (entry) {
            setBootComplete(false);
        }
    }

    useEffect(() => {
        if (entry) {
            triggerElRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            hasResetPlaybackRef.current = false;
        }
    }, [entry]);

    // The clip autoplays muted from the moment the overlay opens (see the video's `muted={!bootComplete}`
    // prop) to preserve the unmuted-autoplay activation window while staying silent behind the boot
    // terminal. At the boot→reveal transition it has already played a few seconds ahead, so jump it back
    // to the start exactly once — guarded by hasResetPlaybackRef so re-renders never restart the clip
    // mid-watch — before the `muted` prop flips to false on the very next render.
    useEffect(() => {
        if (bootComplete && videoElRef.current && !hasResetPlaybackRef.current) {
            hasResetPlaybackRef.current = true;
            videoElRef.current.currentTime = 0;
        }
    }, [bootComplete]);

    // Focus moves to the dialog container itself, not the close button, so a keypress during boot
    // (Enter/Space included) never activates a focused control and falls through to the skip
    // listener in BootTerminal instead of closing the overlay.
    useEffect(() => {
        containerEl?.focus();
    }, [containerEl, entry]);

    const close = useCallback(() => {
        closeEasterEgg();
        triggerElRef.current?.focus();
    }, []);

    useEffect(() => {
        if (!entry) {
            return;
        }

        const handleWindowKeyDown = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Escape") {
                close();
            }
        };

        window.addEventListener("keydown", handleWindowKeyDown, true);
        return () => window.removeEventListener("keydown", handleWindowKeyDown, true);
    }, [entry, close]);

    const handleCardClick = useCallback((event: MouseEvent) => {
        event.stopPropagation();
        setSkipSignal((value) => value + 1);
    }, []);

    const handleBootComplete = useCallback(() => {
        setBootComplete(true);
    }, []);

    return {
        state: { entry, bootComplete, reducedMotion, skipSignal },
        effects: { close, handleCardClick, handleBootComplete, setContainerEl, setVideoEl },
    };
};
