'use client'

import { useEffect, useRef, useState } from 'react';

const observers = new Map<string, IntersectionObserver>();
const observersIntersectionCallbacks = new Map<Element, (isIntersecting: boolean) => void>();

function getObserver(rootMargin: string): IntersectionObserver {
  if (!observers.has(rootMargin)) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
            const observersIntersectionCallback = observersIntersectionCallbacks.get(entry.target)
            observersIntersectionCallback?.(entry.isIntersecting);  
        });
      },
      { rootMargin }
    );
    observers.set(rootMargin, observer);
  }

  return observers.get(rootMargin)!;
}

interface UseInViewListOptions {
  rootMargin: string;
}

export const useInViewList = <T extends HTMLElement = HTMLDivElement>({ rootMargin } : UseInViewListOptions): [React.RefObject<T | null>, boolean] => {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;

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
  }, [rootMargin]);

  return [ref, isInView];
};