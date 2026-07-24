import { posts } from "@/lib/content/posts/posts";
import { authors } from "@/types/content/author";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { Feed } from "feed";

export const dynamic = 'force-static';

export async function GET() {
  const allPosts = posts.list();

  const feed = new Feed({
    title: siteMetadata.title,
    description: siteMetadata.description,
    id: siteMetadata.siteUrl,
    link: `${siteMetadata.siteUrl}`,
    author: {
      name: authors.fabrizio_duroni.name,
      link: authors.fabrizio_duroni.linkedinUrl,
    },
    language: "en",
    copyright: `2025 ${siteMetadata.author}`,
  });

  allPosts.forEach((post) => {
    feed.addItem({
      title: post.frontmatter.title,
      id: `${siteMetadata.siteUrl}${post.slug.formatted}`,
      link: `${siteMetadata.siteUrl}${post.slug.formatted}`,
      description: post.frontmatter.description,
      image: `${siteMetadata.siteUrl}${post.frontmatter.image}`,
      date: new Date(post.frontmatter.date.formatted),
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
