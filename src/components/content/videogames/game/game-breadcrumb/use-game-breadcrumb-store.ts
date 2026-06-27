"use client";

import { StateStore } from "@/types/component-store";
import { BreadcrumbItem } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";
import { slugs } from "@/types/configuration/slug";
import { useVideogamesNavigationOriginStore } from "@/components/content/videogames/use-videogames-navigation-origin-store";
import { VideogamesNavigationOrigin } from "@/types/content/videogames";

interface GameBreadcrumbState {
    items: BreadcrumbItem[];
}

const videogamesBreadcrumb: BreadcrumbItem = {
    label: "Videogames",
    href: slugs.videogames.home,
    isCurrent: false,
};

const buildBreadcrumbItems = (
    origin: VideogamesNavigationOrigin | null,
    gameTitle: string,
    gameSlug: string,
    consoleName: string,
    consoleSlug: string,
): BreadcrumbItem[] => {
    const currentItem: BreadcrumbItem = {
        label: gameTitle,
        href: gameSlug,
        isCurrent: true,
    };

    if (origin === "all-games") {
        return [videogamesBreadcrumb, currentItem];
    }

    return [
        videogamesBreadcrumb,
        {
            label: consoleName,
            href: consoleSlug,
            isCurrent: false,
        },
        currentItem,
    ];
};

interface GameBreadcrumbStoreParams {
    gameTitle: string;
    gameSlug: string;
    consoleName: string;
    consoleSlug: string;
}

export const useGameBreadcrumbStore = ({
    gameTitle,
    gameSlug,
    consoleName,
    consoleSlug,
}: GameBreadcrumbStoreParams): StateStore<GameBreadcrumbState> => {
    const origin = useVideogamesNavigationOriginStore();
    const items = buildBreadcrumbItems(origin, gameTitle, gameSlug, consoleName, consoleSlug);

    return { state: { items } };
};
