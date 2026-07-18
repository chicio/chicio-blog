"use client";

import { FC } from "react";
import { SiCoderabbit } from "react-icons/si";
import { MatrixTerminal } from "@/components/design-system/molecules/effects/matrix-terminal";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { ContentPage } from "@/components/features/content/content-page";
import { easterEggHuntPageDescription, easterEggHuntPageTitle } from "@/lib/content/easter-eggs/easter-eggs-content";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { EggCard } from "./egg-card";
import { useEasterEggsStore } from "./use-easter-eggs-store";

export const EasterEggs: FC = () => {
    const { state, effects } = useEasterEggsStore();
    const { introLines, hints, revealedIds } = state;
    const { toggleReveal } = effects;
    const terminalLines = introLines.map((text) => ({ text }));

    return (
        <ContentPage author={siteMetadata.author} trackingCategory={tracking.category.easter_egg_hunt}>
            <PageTitle>
                <SiCoderabbit className="inline-block mr-3 align-middle" />
                {easterEggHuntPageTitle}
            </PageTitle>
            <p>{easterEggHuntPageDescription}</p>
            <div className="mt-8">
                <MatrixTerminal lines={terminalLines} widthClassName="w-full" />
            </div>
            <div className="mt-8 flex flex-col gap-4">
                {hints.map((hint) => (
                    <EggCard
                        key={hint.id}
                        hint={hint}
                        revealed={revealedIds.has(hint.id)}
                        onToggle={toggleReveal(hint.id)}
                    />
                ))}
            </div>
        </ContentPage>
    );
};
