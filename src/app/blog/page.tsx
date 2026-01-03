import BlogHomePage from "@/app/blog/posts/[page]/page";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";
import { slugs } from "@/types/slug";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  slug: slugs.blog.home,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default async function BlogHome() {
  const params = Promise.resolve({ page: "1" });
  return <BlogHomePage params={params} />;
}
