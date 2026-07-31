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

    const toggle = () => {
        setManuallyOpen((prev) => !prev);
        onToggle?.();
    };

    return {
        state: { isOpen, panelId, triggerId },
        effects: { toggle },
    };
};
