import { FC } from "react";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { videogamesHome } from "@/lib/content/videogames/videogames";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { tracking } from "@/types/configuration/tracking";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { ContentPage } from "@/components/features/content/content-page";
import VideogamesContent from "@/content/videogames/content.mdx";

export const VideogamesCollection: FC = () => {
    const { frontmatter } = videogamesHome.single()!;

    return (
        <ContentPage author={siteMetadata.author} trackingCategory={tracking.category.videogames}>
            <PageTitle>{frontmatter.title}</PageTitle>
            <VideogamesContent />
            <JsonLd
                type="Website"
                url={`${siteMetadata.siteUrl}${slugs.videogames.home}`}
                imageUrl={frontmatter.image}
                title={frontmatter.title}
                description={frontmatter.description}
                keywords={frontmatter.tags}
            />
        </ContentPage>
    );
};
