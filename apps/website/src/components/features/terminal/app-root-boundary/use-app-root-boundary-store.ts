"use client";

import { useCallback, useEffect, useState } from "react";
import { registerAppRootElement } from "@/lib/terminal/terminal-overlay-dom";
import type { EffectsStore } from "@/types/component-store";

interface AppRootBoundaryEffects {
    setEl: (el: HTMLDivElement | null) => void;
}

/**
 * Registers this wrapper's DOM node as the "app root" so the globally
 * mounted terminal overlay can toggle inert/aria-hidden on the real page
 * content while it is open (see src/lib/terminal/terminal-overlay-dom.ts).
 */
export const useAppRootBoundaryStore = (): EffectsStore<AppRootBoundaryEffects> => {
    const [el, setElState] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        registerAppRootElement(el);
        return () => registerAppRootElement(null);
    }, [el]);

    const setEl = useCallback((node: HTMLDivElement | null) => setElState(node), []);

    return { effects: { setEl } };
};
