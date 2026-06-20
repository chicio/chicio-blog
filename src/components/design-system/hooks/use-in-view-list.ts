"use client";

import { useCallback, useEffect, useState } from "react";

const observers = new Map<string, IntersectionObserver>();
const observersIntersectionCallbacks = new Map<Element, (isIntersecting: boolean) => void>();

function getObserver(rootMargin: string): IntersectionObserver {
    if (!observers.has(rootMargin)) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const observersIntersectionCallback = observersIntersectionCallbacks.get(entry.target);
                    observersIntersectionCallback?.(entry.isIntersecting);
                });
            },
            { rootMargin },
        );
        observers.set(rootMargin, observer);
    }

    return observers.get(rootMargin)!;
}

interface UseInViewListOptions {
    rootMargin: string;
}

export const useInViewList = <T extends HTMLElement = HTMLDivElement>(
    { rootMargin }: UseInViewListOptions,
): [(el: T | null) => void, boolean] => {
    const [element, setElement] = useState<T | null>(null);
    const [isInView, setIsInView] = useState(false);
    const setEl = useCallback((el: T | null) => setElement(el), []);

    useEffect(() => {
        if (!element) {
            return;
        }

        observersIntersectionCallbacks.set(element, (isIntersecting: boolean) => {
            if (isIntersecting) {
                setIsInView(true);
            }
        });

        const observer = getObserver(rootMargin);
        observer.observe(element);

        return () => {
            observer.unobserve(element);
            observersIntersectionCallbacks.delete(element);
        };
    }, [rootMargin, element]);

    return [setEl, isInView];
};
