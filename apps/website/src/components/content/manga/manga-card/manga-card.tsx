import { FC } from "react";
import { CoverCardBadge } from "matrix-design-system";
import { CoverCard } from "@/components/features/design-system-next/cover-card";
import { volumesOwnedLabel } from "@/components/content/manga/manga-figures";
import { Content } from "@/types/content/content";
import { MangaMetadata } from "@/types/content/manga";

interface MangaCardProps {
    manga: Content<MangaMetadata>;
}

export const MangaCard: FC<MangaCardProps> = ({ manga }) => {
    const { metadata, title, image } = manga.frontmatter;

    return (
        <CoverCard
            src={image}
            title={title}
            action={{ kind: "link", href: manga.slug.formatted }}
            badges={
                metadata && (
                    <CoverCardBadge>
                        <span className="sr-only">Volumes owned </span>
                        {volumesOwnedLabel(metadata)}
                    </CoverCardBadge>
                )
            }
        />
    );
};
