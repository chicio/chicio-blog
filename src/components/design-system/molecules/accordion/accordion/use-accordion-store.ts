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

export const useAccordionStore = (
    defaultOpen: boolean,
    onToggle?: () => void
): ComponentStore<AccordionState, AccordionEffects> => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const id = useId();
    const panelId = `accordion-panel-${id}`;
    const triggerId = `accordion-trigger-${id}`;

    const toggle = () => {
        setIsOpen((prev) => !prev);
        onToggle?.();
    };

    return {
        state: { isOpen, panelId, triggerId },
        effects: { toggle },
    };
};
