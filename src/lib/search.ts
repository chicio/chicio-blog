import elasticlunr from "elasticlunr";
import {getPosts} from "@/lib/posts";
import {SearchablePostFields} from "@/types/post";

export const createSearchIndex = () => {
    const posts = getPosts();
    const index = elasticlunr<SearchablePostFields>(function () {
        this.addField("title");
        this.addField("description");
        this.addField("tags");
        this.addField("authors");
        this.addField("content");
        this.setRef("slug");
    });

    posts.forEach((post) => index.addDoc({
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        tags: post.frontmatter.tags,
        authors: post.frontmatter.authors,
        content: post.content,
        slug: post.frontmatter.slug,
    }));

    return index;
};
