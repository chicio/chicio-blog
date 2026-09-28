import { FC } from "react";
import { PageTitle } from "matrix-design-system";
import { mangaHome } from "@/lib/content/manga/manga";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { tracking } from "@/types/configuration/tracking";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { ContentPage } from "@/components/features/content/content-page";
import MangaContent from "@/content/manga/content.mdx";

export const MangaCollection: FC = () => {
    const { frontmatter } = mangaHome.single()!;

    return (
        <ContentPage author={siteMetadata.author} trackingCategory={tracking.category.manga}>
            <PageTitle>{frontmatter.title}</PageTitle>
            <MangaContent />
            <JsonLd
                type="Website"
                url={`${siteMetadata.siteUrl}${slugs.manga.home}`}
                imageUrl={frontmatter.image}
                title={frontmatter.title}
                description={frontmatter.description}
                keywords={frontmatter.tags}
            />
        </ContentPage>
    );
};
