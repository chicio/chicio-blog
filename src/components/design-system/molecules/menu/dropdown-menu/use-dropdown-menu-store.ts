"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import type { ComponentStore } from "@/types/component-store";
import React from "react";

interface DropdownMenuState {
    open: boolean;
    selected: boolean;
    shouldReduceMotions: boolean;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
    id: string;
}

interface DropdownMenuEffects {
    toggleOpen: () => void;
    handleBlur: (e: React.FocusEvent<HTMLButtonElement | HTMLDivElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const useDropdownMenuStore = (hasSelected: boolean): ComponentStore<DropdownMenuState, DropdownMenuEffects> => {
    const shouldReduceMotions = useReducedMotions();
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const id = useId();

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
        if (e.key === "Escape") {
            setOpen(false);
            buttonRef.current?.focus();
        }
    };

    return {
        state: { open, selected: hasSelected, shouldReduceMotions, buttonRef, id },
        effects: { toggleOpen, handleBlur, handleKeyDown },
    };
};
