"use client";

import { useCallback, useEffect, useState } from "react";
import type { MouseEvent } from "react";
import {
    lightboxOpenEvent,
    type LightboxOpenDetail,
} from "@/components/design-system/state/lightbox/lightbox-events";
import type { ComponentStore } from "@/types/component-store";

interface LightboxState {
    open: boolean;
    src: string;
    alt: string;
}

interface LightboxEffects {
    setDialogEl: (el: HTMLDivElement | null) => void;
    close: () => void;
    stopPropagation: (e: MouseEvent) => void;
}

export const useLightboxStore = (): ComponentStore<LightboxState, LightboxEffects> => {
    const [open, setOpen] = useState(false);
    const [src, setSrc] = useState("");
    const [alt, setAlt] = useState("");
    const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
    const [dialogEl, setDialogEl] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleOpenEvent = (event: Event) => {
            const { detail } = event as CustomEvent<LightboxOpenDetail>;
            setTriggerEl(document.activeElement instanceof HTMLElement ? document.activeElement : null);
            setSrc(detail.src);
            setAlt(detail.alt);
            setOpen(true);
        };

        window.addEventListener(lightboxOpenEvent, handleOpenEvent);
        return () => window.removeEventListener(lightboxOpenEvent, handleOpenEvent);
    }, []);

    useEffect(() => {
        dialogEl?.focus();
    }, [dialogEl]);

    const close = useCallback(() => {
        setOpen(false);
        triggerEl?.focus();
    }, [triggerEl]);

    const stopPropagation = useCallback((e: MouseEvent) => e.stopPropagation(), []);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleEsc = (e: globalThis.KeyboardEvent) => {
            if (e.key === "Escape") {
                close();
            }
        };

        window.addEventListener("keydown", handleEsc, true);
        return () => window.removeEventListener("keydown", handleEsc, true);
    }, [open, close]);

    return {
        state: { open, src, alt },
        effects: { setDialogEl, close, stopPropagation },
    };
};
