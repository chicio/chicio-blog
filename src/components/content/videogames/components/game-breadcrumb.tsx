"use client";

import { FC } from "react";
import { Breadcrumb, BreadcrumbItem } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";
import { tracking } from "@/types/configuration/tracking";
import { slugs } from "@/types/configuration/slug";
import { useVideogamesNavigationOriginStore } from "@/components/content/videogames/hooks/use-videogames-navigation-origin-store";
import { VideogamesNavigationOrigin } from "@/types/content/videogames";

interface GameBreadcrumbProps {
    gameTitle: string;
    gameSlug: string;
    consoleName: string;
    consoleSlug: string;
}

const videogamesBreadcrumb: BreadcrumbItem = {
    label: "Videogames",
    href: slugs.videogames.home,
    isCurrent: false,
    trackingData: {
        action: tracking.action.open_videogame_collection,
        category: tracking.category.videogames,
        label: tracking.label.body,
    },
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
            trackingData: {
                action: tracking.action.open_videogame_console,
                category: tracking.category.videogames,
                label: tracking.label.body,
            },
        },
        currentItem,
    ];
};

export const GameBreadcrumb: FC<GameBreadcrumbProps> = ({
    gameTitle,
    gameSlug,
    consoleName,
    consoleSlug,
}) => {
    const origin = useVideogamesNavigationOriginStore();

    const items = buildBreadcrumbItems(origin, gameTitle, gameSlug, consoleName, consoleSlug);

    return <Breadcrumb items={items} />;
};
