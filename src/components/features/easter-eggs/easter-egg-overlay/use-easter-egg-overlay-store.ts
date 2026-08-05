"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { useTypewriter } from "@/components/design-system/hooks/use-typewriter";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import { EASTER_EGG_CATALOG, type EasterEggCatalogEntry } from "@/lib/easter-eggs/easter-egg-catalog";
import {
    closeEasterEgg,
    getEasterEggOverlaySlug,
    subscribeToEasterEggOverlay,
} from "@/lib/easter-eggs/easter-egg-overlay-state";
import type { ComponentStore } from "@/types/component-store";
import { bootLinesFor, toTypewriterLines } from "./boot-lines";

const BOOT_TYPING_SPEED_MS = 25;

const getServerSlugSnapshot = (): null => null;

interface EasterEggOverlayState {
    entry: EasterEggCatalogEntry | null;
    completedBootLines: string[];
    activeBootLine: string | null;
    bootComplete: boolean;
    reducedMotion: boolean;
}

interface EasterEggOverlayEffects {
    close: () => void;
    handleCardClick: (event: MouseEvent) => void;
    setCloseButtonEl: (el: HTMLButtonElement | null) => void;
}

export const useEasterEggOverlayStore = (): ComponentStore<EasterEggOverlayState, EasterEggOverlayEffects> => {
    const slug = useSyncExternalStore(subscribeToEasterEggOverlay, getEasterEggOverlaySlug, getServerSlugSnapshot);
    const reducedMotion = useReducedMotions();
    const [skipped, setSkipped] = useState(false);
    const [closeButtonEl, setCloseButtonEl] = useState<HTMLButtonElement | null>(null);
    const [previousEntry, setPreviousEntry] = useState<EasterEggCatalogEntry | null>(null);
    const triggerElRef = useRef<HTMLElement | null>(null);

    const entry = slug ? EASTER_EGG_CATALOG[slug] : null;
    const bootLines = entry ? bootLinesFor(entry.slug) : [];
    const shouldType = entry !== null && !reducedMotion && !skipped;

    if (previousEntry !== entry) {
        setPreviousEntry(entry);

        if (entry) {
            setSkipped(false);
        }
    }

    useEffect(() => {
        if (entry) {
            triggerElRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }
    }, [entry]);

    const { completedLines, currentLine, currentText, isComplete } = useTypewriter(
        toTypewriterLines(bootLines),
        BOOT_TYPING_SPEED_MS,
        shouldType,
    );

    const bootComplete = entry === null || reducedMotion || skipped || isComplete;

    useEffect(() => {
        closeButtonEl?.focus();
    }, [closeButtonEl]);

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
                return;
            }

            if (!bootComplete) {
                setSkipped(true);
            }
        };

        window.addEventListener("keydown", handleWindowKeyDown, true);
        return () => window.removeEventListener("keydown", handleWindowKeyDown, true);
    }, [entry, bootComplete, close]);

    const handleCardClick = useCallback(
        (event: MouseEvent) => {
            event.stopPropagation();

            if (!bootComplete) {
                setSkipped(true);
            }
        },
        [bootComplete],
    );

    const completedBootLines = bootComplete ? bootLines : completedLines.map((line) => line.text);
    const activeBootLine = !bootComplete && currentLine ? currentText : null;

    return {
        state: { entry, completedBootLines, activeBootLine, bootComplete, reducedMotion },
        effects: { close, handleCardClick, setCloseButtonEl },
    };
};
