import { CookiePolicy } from "@/components/content/cookie-policy/cookie-policy";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.cookiePolicy,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function CookiePolicyPage() {
  return <CookiePolicy />;
}
