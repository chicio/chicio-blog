'use client'

import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export const useInView = <T extends HTMLElement = HTMLDivElement>(
    options: UseInViewOptions = {}
): [element: React.RefObject<T | null>, boolean] => {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = false } = options;
    const ref = useRef<T>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        
        if (!element) {
            return;
        }

        if (triggerOnce && isInView) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        if (triggerOnce) {
                            observer.disconnect();
                        }
                    } else if (!triggerOnce) {
                        setIsInView(false);
                    }
                });
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, triggerOnce, isInView]);

    return [ref, isInView];
};
