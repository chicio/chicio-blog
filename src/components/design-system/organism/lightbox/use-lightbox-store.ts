"use client";

import { useCallback, useEffect, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
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
    handleKeyDown: (e: KeyboardEvent) => void;
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

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                close();
            }
        },
        [close],
    );

    return {
        state: { open, src, alt },
        effects: { setDialogEl, close, stopPropagation, handleKeyDown },
    };
};
