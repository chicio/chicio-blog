import elasticlunr from "elasticlunr";
import { Content } from "@/types/content/content";
import { SearchablePostFields } from "@/types/search/search";

export const createSearchIndex = (contents: Content[]): elasticlunr.Index<SearchablePostFields> => {
    const index = elasticlunr<SearchablePostFields>(function () {
        this.addField("title");
        this.addField("description");
        this.addField("tags");
        this.addField("authors");
        this.setRef("slug");
    });

    contents.forEach((content) =>
        index.addDoc({
            slug: content.slug.formatted,
            title: content.frontmatter.title,
            description: content.frontmatter.description,
            tags: content.frontmatter.tags,
            authors: content.frontmatter.authors.map((author) => author.name),
        }),
    );

    return index;
};
