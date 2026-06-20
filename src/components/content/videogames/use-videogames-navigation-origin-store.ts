"use client";

import { useSyncExternalStore } from "react";
import {
    readVideogamesNavigationOrigin,
    videogamesNavigationOriginChangeEvent,
} from "@/lib/videogames/videogames-navigation-origin";
import { VideogamesNavigationOrigin } from "@/types/content/videogames";

const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") {
        return () => {};
    }

    window.addEventListener(videogamesNavigationOriginChangeEvent, callback);

    return () => {
        window.removeEventListener(videogamesNavigationOriginChangeEvent, callback);
    };
};

const getSnapshot = (): VideogamesNavigationOrigin | null => readVideogamesNavigationOrigin();

const getServerSnapshot = (): VideogamesNavigationOrigin | null => null;

export const useVideogamesNavigationOriginStore = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
