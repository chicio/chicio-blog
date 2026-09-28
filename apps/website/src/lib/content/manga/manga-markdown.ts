import { mangaHome, mangas } from "@/lib/content/manga/manga";
import { serializationLabel } from "@/lib/content/manga/manga-figures";
import { contentBodyMarkdown } from "@/lib/mdx/content-body-markdown";
import { contentItemMarkdown } from "@/lib/mdx/content-item-markdown";
import { siteMetadata } from "@/types/configuration/site-metadata";

export const mangaListMarkdown = contentItemMarkdown(mangaHome, (home) => {
    const allManga = mangas.list();

    return `${contentBodyMarkdown(home)}

## Manga (${allManga.length})

${allManga.map((m) => `- [${m.frontmatter.title}](${siteMetadata.siteUrl}${m.slug.formatted}) (${m.frontmatter.metadata?.volumesOwned ?? "?"}/${m.frontmatter.metadata?.volumes ?? "?"} Volumes owned) — ${m.frontmatter.description}`).join("\n")}
`;
});

export const mangaMarkdown = contentItemMarkdown(mangas, (manga) => {
    const metadata = manga.frontmatter.metadata!;

    return `**Story by:** ${metadata.storyBy.join(", ")}
**Art by:** ${metadata.artBy.join(", ")}
**Original publisher:** ${metadata.originalPublisher}
**Magazine:** ${metadata.magazine}
**Serialization:** ${serializationLabel(metadata)}
**Demographic:** ${metadata.demographic}
**Genres:** ${metadata.genres.join(", ")}
**Status:** ${metadata.status}
**Edition:** ${metadata.edition} (${metadata.editionPublisher}, ${metadata.language})
**Volumes owned:** ${metadata.volumesOwned}/${metadata.volumes}
**Acquired:** ${metadata.acquiredYear}

${contentBodyMarkdown(manga)}
`;
});
