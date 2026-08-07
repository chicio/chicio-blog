"use client";

import { useEffect, useRef, useState } from "react";
import { useTypewriter } from "@/components/design-system/hooks/use-typewriter";
import { bootLinesFor, toTypewriterLines } from "@/lib/easter-eggs/boot-lines";
import type { EasterEggSlug } from "@/lib/easter-eggs/easter-egg-catalog";
import type { StateStore } from "@/types/component-store";

const BOOT_TYPING_SPEED_MS = 25;

interface BootTerminalState {
    completedLines: string[];
    activeLine: string | null;
    bootComplete: boolean;
}

/**
 * Owns the typewriter's own hook state. Mounted fresh (see the `key={slug}` at the call site) for
 * every egg open so a second egg in the same page session types from scratch instead of inheriting
 * the first egg's finished lineIndex/charIndex — `useTypewriter` has no reset API of its own, so a
 * remount is the only way to restart it.
 *
 * `skipSignal` is a counter the card's click handler bumps (see the parent store) — bumping it while
 * this component is already mounted skips the boot. The comparison happens during render (the
 * "adjust state when a prop changes" pattern), seeded with the CURRENT skipSignal value at mount, so
 * a fresh mount never skips itself just because a previous egg had already bumped the counter.
 */
export const useBootTerminalStore = (
    slug: EasterEggSlug,
    reducedMotion: boolean,
    skipSignal: number,
    onBootComplete: () => void,
): StateStore<BootTerminalState> => {
    const [skipped, setSkipped] = useState(false);
    const [previousSkipSignal, setPreviousSkipSignal] = useState(skipSignal);
    const bootLines = bootLinesFor(slug);
    const shouldType = !reducedMotion && !skipped;

    if (previousSkipSignal !== skipSignal) {
        setPreviousSkipSignal(skipSignal);
        setSkipped(true);
    }

    const { completedLines, currentLine, currentText, isComplete } = useTypewriter(
        toTypewriterLines(bootLines),
        BOOT_TYPING_SPEED_MS,
        shouldType,
    );

    const bootComplete = !shouldType || isComplete;

    const hasNotifiedRef = useRef(false);
    useEffect(() => {
        if (bootComplete && !hasNotifiedRef.current) {
            hasNotifiedRef.current = true;
            onBootComplete();
        }
    }, [bootComplete, onBootComplete]);

    useEffect(() => {
        if (bootComplete) {
            return;
        }

        const handleWindowKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") {
                setSkipped(true);
            }
        };

        window.addEventListener("keydown", handleWindowKeyDown, true);
        return () => window.removeEventListener("keydown", handleWindowKeyDown, true);
    }, [bootComplete]);

    const displayedLines = bootComplete ? bootLines : completedLines.map((line) => line.text);
    const activeLine = !bootComplete && currentLine ? currentText : null;

    return {
        state: { completedLines: displayedLines, activeLine, bootComplete },
    };
};
