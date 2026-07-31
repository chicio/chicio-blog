"use client";

import { useId, useState } from "react";
import type { ComponentStore } from "@/types/component-store";

interface AccordionState {
    isOpen: boolean;
    panelId: string;
    triggerId: string;
}

interface AccordionEffects {
    toggle: () => void;
}

/**
 * `forceOpen` keeps the panel open regardless of `manuallyOpen`, without taking over the toggle button
 * itself — a caller that knows a panel should currently be visible (e.g. the reading companion's
 * scroll-spy keeping the active section's group expanded) can drive that from outside, while the user
 * can still freely toggle; their manual state simply has no visible effect until `forceOpen` clears.
 */
export const useAccordionStore = (
    defaultOpen: boolean,
    onToggle?: () => void,
    forceOpen?: boolean,
): ComponentStore<AccordionState, AccordionEffects> => {
    const [manuallyOpen, setManuallyOpen] = useState(defaultOpen);
    const id = useId();
    const panelId = `accordion-panel-${id}`;
    const triggerId = `accordion-trigger-${id}`;
    const isOpen = forceOpen || manuallyOpen;

    /**
     * Flips relative to the currently *visible* `isOpen`, not to the last remembered `manuallyOpen` value.
     * A panel can be visibly open purely because `forceOpen` is true while `manuallyOpen` is still false
     * (never clicked) — flipping `manuallyOpen`'s own stale value would toggle it to `true`, which changes
     * nothing visible now (forceOpen still wins) but wrongly "records" an open intent that keeps the panel
     * open even after `forceOpen` later clears. Flipping the visible state instead means a click while
     * forced open records "closed", so the panel correctly stays closed once forceOpen clears.
     */
    const toggle = () => {
        setManuallyOpen(!isOpen);
        onToggle?.();
    };

    return {
        state: { isOpen, panelId, triggerId },
        effects: { toggle },
    };
};
