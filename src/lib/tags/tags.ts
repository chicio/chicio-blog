import { slugs } from "@/types/slug";

export const generateTagSlug = (tag: string) =>
    `${slugs.blog.tag}/${tag.split(" ").join("-")}/`;
