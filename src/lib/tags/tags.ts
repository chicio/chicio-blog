import { slugs } from "@/types/slug";

export const generateTagSlug = (tag: string) =>
    `${slugs.blog.tags}/${tag.split(" ").join("-")}/`;
