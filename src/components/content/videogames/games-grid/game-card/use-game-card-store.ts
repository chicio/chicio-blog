"use client";

import { useCallback, useEffect, useState } from "react";
import { ComponentStore } from "@/types/component-store";
import { VideogamesNavigationOrigin } from "@/types/content/videogames";
import { writeVideogamesNavigationOrigin } from "@/lib/videogames/videogames-navigation-origin";

interface GameCardState {
    isInView: boolean;
}

interface GameCardEffects {
    setEl: (el: HTMLDivElement | null) => void;
    handleClick: (navigationOrigin: VideogamesNavigationOrigin) => () => void;
}

export const useGameCardStore = (): ComponentStore<GameCardState, GameCardEffects> => {
    const [el, setEl] = useState<HTMLDivElement | null>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        if (!el) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                    }
                });
            },
            { rootMargin: "600px" },
        );

        observer.observe(el);

        return () => {
            observer.unobserve(el);
        };
    }, [el]);

    const handleClick = useCallback(
        (navigationOrigin: VideogamesNavigationOrigin) => () => {
            writeVideogamesNavigationOrigin(navigationOrigin);
        },
        [],
    );

    return {
        state: { isInView },
        effects: { setEl, handleClick },
    };
};
