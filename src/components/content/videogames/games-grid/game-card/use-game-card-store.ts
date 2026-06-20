"use client";

import { useCallback } from "react";
import { ComponentStore } from "@/types/component-store";
import { VideogamesNavigationOrigin } from "@/types/content/videogames";
import { writeVideogamesNavigationOrigin } from "@/lib/videogames/videogames-navigation-origin";
import { useInViewList } from "@/components/design-system/hooks/use-in-view-list";

interface GameCardState {
    isInView: boolean;
}

interface GameCardEffects {
    setEl: (el: HTMLDivElement | null) => void;
    handleClick: (navigationOrigin: VideogamesNavigationOrigin) => () => void;
}

export const useGameCardStore = (): ComponentStore<GameCardState, GameCardEffects> => {
    const [setEl, isInView] = useInViewList<HTMLDivElement>({ rootMargin: "600px" });

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
