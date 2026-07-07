import { BlogStats } from "@/components/content/blog/blog-stats";
import { getBlogStats } from "@/lib/stats/blog-stats";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return createMetadata({
        author: siteMetadata.author,
        title: `Blog Stats — ${siteMetadata.title}`,
        description:
            "Statistics about this blog: total posts, words written, reading time, posts per year, top tags, and posts per author.",
        slug: slugs.blog.stats,
        imageUrl: siteMetadata.featuredImage,
        ogPageType: "website",
    });
}

export default async function Stats() {
    const stats = getBlogStats();
    const author = siteMetadata.author;

    return (
        <BlogStats
            author={author}
            stats={stats}
        />
    );
}
