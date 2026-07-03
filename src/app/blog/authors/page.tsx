import { BlogAuthors } from "@/components/content/blog/blog-authors";
import { getAuthorsWithPosts } from "@/lib/content/posts/posts";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return createMetadata({
        author: siteMetadata.author,
        title: siteMetadata.title,
        description: siteMetadata.description,
        slug: slugs.blog.authors,
        imageUrl: siteMetadata.featuredImage,
        ogPageType: "website",
    });
}

export default async function Authors() {
    const authors = getAuthorsWithPosts();
    const author = siteMetadata.author;

    return (
        <BlogAuthors
            author={author}
            authors={authors}
        />
    );
}
