import { FC, PropsWithChildren } from "react";
import { CoverCardBadge, PageTitle } from "matrix-design-system";
import { ReadingContentPage } from "@/components/features/content/reading-content-page";
import { PreviousNextNavigation } from "@/components/features/design-system-next/previous-next-navigation";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { volumesOwnedLabel } from "@/lib/content/manga/manga-figures";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { tracking } from "@/types/configuration/tracking";
import { Content } from "@/types/content/content";
import { MangaMetadata } from "@/types/content/manga";
import { MangaInformation } from "./manga-information";

interface MangaProps {
    manga: Content<MangaMetadata>;
    previous?: Content<MangaMetadata>;
    next?: Content<MangaMetadata>;
}

export const Manga: FC<PropsWithChildren<MangaProps>> = async ({ manga, previous, next }) => {
    const { contentFileRelativePath: contentPath, frontmatter } = manga;
    const { metadata } = frontmatter;
    const { default: MangaContent } = await import(`@/content/${contentPath}/content.mdx`);
    const mdxComponents = {
        MangaInformation: () => (metadata ? <MangaInformation metadata={metadata} className="mb-6" /> : null),
    };

    return (
        <ReadingContentPage
            author={siteMetadata.author}
            trackingCategory={tracking.category.manga}
            breadcrumbs={[
                { label: "Manga", href: slugs.manga.home, isCurrent: false },
                { label: frontmatter.title, href: manga.slug.formatted, isCurrent: true },
            ]}
        >
            <PageTitle>{frontmatter.title}</PageTitle>
            {metadata && (
                <div className="mb-6 flex flex-row flex-wrap gap-2">
                    <CoverCardBadge>{metadata.edition}</CoverCardBadge>
                    <CoverCardBadge>
                        <span className="sr-only">Volumes owned </span>
                        {volumesOwnedLabel(metadata)}
                    </CoverCardBadge>
                </div>
            )}
            <MangaContent components={mdxComponents} />
            <PreviousNextNavigation
                previous={previous ? { url: previous.slug.formatted, title: previous.frontmatter.title } : undefined}
                next={next ? { url: next.slug.formatted, title: next.frontmatter.title } : undefined}
            />
            <JsonLd
                type="Website"
                url={`${siteMetadata.siteUrl}${manga.slug.formatted}`}
                imageUrl={frontmatter.image}
                title={frontmatter.title}
                description={frontmatter.description}
                keywords={frontmatter.tags}
            />
        </ReadingContentPage>
    );
};
