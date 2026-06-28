"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import type { ComponentStore } from "@/types/component-store";
import React from "react";

interface DropdownMenuState {
    open: boolean;
    selected: boolean;
    shouldReduceMotions: boolean;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
}

interface DropdownMenuEffects {
    toggleOpen: () => void;
    handleBlur: (e: React.FocusEvent<HTMLButtonElement | HTMLDivElement>) => void;
    handleItemClick: (onTrack?: () => void, onClick?: () => void) => () => void;
}

export const useDropdownMenuStore = (hasSelected: boolean): ComponentStore<DropdownMenuState, DropdownMenuEffects> => {
    const shouldReduceMotions = useReducedMotions();
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

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

    const handleItemClick = (onTrack?: () => void, onClick?: () => void) => () => {
        onTrack?.();
        onClick?.();
    };

    return {
        state: { open, selected: hasSelected, shouldReduceMotions, buttonRef },
        effects: { toggleOpen, handleBlur, handleItemClick },
    };
};
