import { BlogAuthor } from "@/components/content/blog/blog-author";
import { authorIdToSlug, getAuthorWithPostsBySlug, getAuthorsWithPosts } from "@/lib/content/posts/posts";
import { ownerAuthorId } from "@/lib/content/authors/author-slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { NextAuthorParameters } from "@/types/next/page-parameters";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
    const authors = getAuthorsWithPosts();

    return authors
        .filter((entry) => entry.author.id !== ownerAuthorId)
        .map((entry) => ({ authorId: authorIdToSlug(entry.author.id) }));
}

export async function generateMetadata({ params }: NextAuthorParameters): Promise<Metadata> {
    const { authorId } = await params;
    const entry = getAuthorWithPostsBySlug(authorId);

    if (!entry) {
        return {};
    }

    return createMetadata({
        author: siteMetadata.author,
        title: `${entry.author.name} - ${siteMetadata.title}`,
        description: siteMetadata.description,
        slug: `${slugs.blog.home}/author/${authorId}`,
        imageUrl: entry.author.image,
        ogPageType: "profile",
    });
}

export default async function AuthorPage({ params }: NextAuthorParameters) {
    const { authorId } = await params;
    const entry = getAuthorWithPostsBySlug(authorId);

    if (!entry) {
        notFound();
    }

    return (
        <BlogAuthor
            author={entry.author}
            posts={entry.posts}
        />
    );
}
