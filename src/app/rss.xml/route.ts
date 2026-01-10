import { getPosts } from "@/lib/content/posts";
import { authors } from "@/types/content/author";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { Feed } from "feed";

export const dynamic = 'force-static';

export async function GET() {
  const posts = getPosts();

  const feed = new Feed({
    title: siteMetadata.title,
    description: siteMetadata.description,
    id: siteMetadata.siteUrl,
    link: `${siteMetadata.siteUrl}`,
    author: {
      name: authors.fabrizio_duroni.name,
      email: "fabrizio.duroni@gmail.com",
      link: authors.fabrizio_duroni.url,
    },
    language: "en",
    copyright: `2025 ${siteMetadata.author}`,
  });

  posts.forEach((post) => {
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
