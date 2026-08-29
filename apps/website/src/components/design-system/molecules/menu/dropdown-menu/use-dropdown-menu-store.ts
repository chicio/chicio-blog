"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import type { ComponentStore } from "matrix-component-store";
import React from "react";

interface DropdownMenuState {
    open: boolean;
    selected: boolean;
    shouldReduceMotions: boolean;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
    panelId: string;
}

interface DropdownMenuEffects {
    toggleOpen: () => void;
    handleBlur: (e: React.FocusEvent<HTMLButtonElement | HTMLDivElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    getGroupId: (index: number) => string;
}

export const useDropdownMenuStore = (hasSelected: boolean): ComponentStore<DropdownMenuState, DropdownMenuEffects> => {
    const shouldReduceMotions = useReducedMotions();
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const id = useId();
    const panelId = `${id}-panel`;

    useEffect(() => {
        if (!open) {
            return;
        }
        const handleScroll = () => setOpen(false);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [open]);

    const toggleOpen = () => setOpen((v) => !v);

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement | HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!open) {
            return;
        }
        if (e.key === "Escape") {
            setOpen(false);
            buttonRef.current?.focus();
        }
    };

    const getGroupId = (index: number) => `${id}-group-${index}`;

    return {
        state: { open, selected: hasSelected, shouldReduceMotions, buttonRef, panelId },
        effects: { toggleOpen, handleBlur, handleKeyDown, getGroupId },
    };
};
