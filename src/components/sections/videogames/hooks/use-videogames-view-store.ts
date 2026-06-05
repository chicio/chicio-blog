"use client";

import { useSyncExternalStore } from "react";
import {
    readVideogamesView,
    videogamesViewChangeEvent,
    VideogamesView,
} from "@/lib/videogames/videogames-view";

const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") {
        return () => {};
    }

    window.addEventListener(videogamesViewChangeEvent, callback);

    return () => {
        window.removeEventListener(videogamesViewChangeEvent, callback);
    };
};

const getSnapshot = (): VideogamesView => readVideogamesView();

const getServerSnapshot = (): VideogamesView | null => null;

export const useVideogamesViewStore = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
