import { FC } from "react";
import { PageTitle } from "matrix-design-system";
import { ContentPage } from "@/components/features/content/content-page";
import { EggHuntProgress } from "@/components/content/easter-eggs/egg-hunt-progress";
import { easterEggHunt } from "@/lib/content/easter-eggs/easter-eggs";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import EasterEggHuntContent from "@/content/easter-egg-hunt/content.mdx";

export const EasterEggs: FC = () => {
    const { frontmatter } = easterEggHunt.single()!;

    return (
        <ContentPage author={siteMetadata.author} trackingCategory={tracking.category.easter_egg_hunt}>
            <PageTitle>{frontmatter.title}</PageTitle>
            <p>{frontmatter.description}</p>
            <EggHuntProgress />
            <div className="mt-8 flex flex-col gap-4">
                <EasterEggHuntContent />
            </div>
        </ContentPage>
    );
};
