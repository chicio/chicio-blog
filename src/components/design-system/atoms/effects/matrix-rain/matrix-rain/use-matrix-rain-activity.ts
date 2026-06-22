"use client";

import { useEffect, useState } from "react";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";

export function useMatrixRainActivity(element: HTMLElement | null): boolean {
    const reducedMotion = useReducedMotions();
    const [onScreen, setOnScreen] = useState(true);

    useEffect(() => {
        if (!element) {
            return;
        }

        const observer = new window.IntersectionObserver(
            ([entry]) => {
                setOnScreen(entry.isIntersecting || entry.intersectionRect.height > 0);
            },
            { root: null, rootMargin: "-50px 0px -50px 0px", threshold: 0 },
        );
        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [element]);

    return reducedMotion || !onScreen;
}
