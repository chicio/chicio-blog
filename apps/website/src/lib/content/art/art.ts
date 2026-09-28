import { slugs } from "@/types/configuration/slug";
import { ArtGalleryItem, ArtMetadata } from "@/types/content/art";
import { createSection } from "../section";

/** The art page itself: its own MDX frontmatter carries the drawings in `metadata.gallery`. */
export const art = createSection<ArtMetadata>({ slug: slugs.art });

export const artGallery = (): ArtGalleryItem[] => art.single()?.frontmatter.metadata?.gallery ?? [];
