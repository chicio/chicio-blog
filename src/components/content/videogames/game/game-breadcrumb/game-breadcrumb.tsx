"use client";

import { FC } from "react";
import { Breadcrumb } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";
import { useGameBreadcrumbStore } from "./use-game-breadcrumb-store";

interface GameBreadcrumbProps {
    gameTitle: string;
    gameSlug: string;
    consoleName: string;
    consoleSlug: string;
}

export const GameBreadcrumb: FC<GameBreadcrumbProps> = ({ gameTitle, gameSlug, consoleName, consoleSlug }) => {
    const { state } = useGameBreadcrumbStore({ gameTitle, gameSlug, consoleName, consoleSlug });
    const { items } = state;

    return <Breadcrumb items={items} />;
};
