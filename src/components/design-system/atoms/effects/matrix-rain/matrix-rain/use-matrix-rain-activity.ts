"use client";

import { RefObject, useEffect, useState } from "react";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";

export function useMatrixRainActivity(ref: RefObject<HTMLElement | null>): boolean {
    const reducedMotion = useReducedMotions();
    const [onScreen, setOnScreen] = useState(true);

    useEffect(() => {
        const element = ref.current;

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
    }, [ref]);

    return reducedMotion || !onScreen;
}
