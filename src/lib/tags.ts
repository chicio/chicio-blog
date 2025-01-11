export const generateTagSlug = (tag: string) =>
    `/blog/tag/${tag.split(" ").join("-")}/`;
