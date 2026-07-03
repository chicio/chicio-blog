import { slugs } from "@/types/configuration/slug";

export const authorIdToSlug = (authorId: string): string => authorId.replaceAll("_", "-");

export const authorSlugToId = (authorSlug: string): string => authorSlug.replaceAll("-", "_");

export const generateAuthorSlug = (authorId: string): string =>
    slugs.blog.author.replace("[authorId]", authorIdToSlug(authorId));
