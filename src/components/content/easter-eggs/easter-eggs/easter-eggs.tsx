"use client";

import { FC } from "react";
import { GiRabbit } from "react-icons/gi";
import { MatrixTerminal } from "@/components/design-system/molecules/effects/matrix-terminal";
import { GenericHeader } from "@/components/design-system/organism/header/generic-header";
import { PageTemplate } from "@/components/design-system/templates/page-template";
import { footerNavHrefs, menuNavHrefs, socialContactLinks } from "@/components/features/content/nav-config";
import { easterEggHuntPageDescription, easterEggHuntPageTitle } from "@/lib/content/easter-eggs/easter-eggs-content";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { EggCard } from "./egg-card";
import { useEasterEggsStore } from "./use-easter-eggs-store";

export const EasterEggs: FC = () => {
    const { state, effects } = useEasterEggsStore();
    const { introLines, hints, revealedIds } = state;
    const { toggleReveal } = effects;
    const terminalLines = introLines.map((text) => ({ text }));

    return (
        <PageTemplate
            header={
                <GenericHeader
                    title={easterEggHuntPageTitle}
                    subtitle={easterEggHuntPageDescription}
                    logo={<GiRabbit className="text-3xl text-accent" />}
                />
            }
            author={siteMetadata.author}
            navHrefs={menuNavHrefs}
            footerNavHrefs={footerNavHrefs}
            socialLinks={socialContactLinks}
        >
            <MatrixTerminal lines={terminalLines} />
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
        </PageTemplate>
    );
};
