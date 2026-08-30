"use client";

import { ReactEventHandler, useCallback, useState } from "react";
import type { ComponentStore } from "matrix-component-store";

interface PlainImageState {
    loaded: boolean;
}

interface PlainImageEffects {
    setImage: (image: HTMLImageElement | null) => void;
    handleLoad: ReactEventHandler<HTMLImageElement>;
}

/**
 * Tracks whether the image has painted, so the placeholder behind it can be dropped once it has —
 * `next/image` does the same.
 *
 * The `complete` check in the ref callback matters for server-rendered markup: an image the browser
 * already has cached can finish loading before React attaches its handlers, and the `load` event
 * would then never reach us, leaving the placeholder showing through a transparent PNG forever.
 */
export const usePlainImageStore = (
    onLoad?: ReactEventHandler<HTMLImageElement>,
): ComponentStore<PlainImageState, PlainImageEffects> => {
    const [loaded, setLoaded] = useState(false);

    const setImage = useCallback((image: HTMLImageElement | null) => {
        if (image?.complete) {
            setLoaded(true);
        }
    }, []);

    const handleLoad = useCallback<ReactEventHandler<HTMLImageElement>>(
        (event) => {
            setLoaded(true);
            onLoad?.(event);
        },
        [onLoad],
    );

    return {
        state: { loaded },
        effects: { setImage, handleLoad },
    };
};
