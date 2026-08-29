import { slugs } from "@/types/configuration/slug";

export const generateTagSlug = (tag: string) =>
    `${slugs.blog.tag}/${tag.split(" ").join("-")}/`;
