import { FC } from "react";
import { CoverCardBadge } from "matrix-design-system";
import { CoverCard } from "@/components/features/design-system-next/cover-card";
import { volumesOwnedLabel } from "@/lib/content/manga/manga-figures";
import { Content } from "@/types/content/content";
import { MangaMetadata } from "@/types/content/manga";
import { useMangaCardStore } from "./use-manga-card-store";

interface MangaCardProps {
    manga: Content<MangaMetadata>;
}

export const MangaCard: FC<MangaCardProps> = ({ manga }) => {
    const { metadata, title, image } = manga.frontmatter;
    const { effects } = useMangaCardStore();

    return (
        <CoverCard
            src={image}
            title={title}
            action={{ kind: "link", href: manga.slug.formatted, onClick: effects.onTrackOpen }}
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
