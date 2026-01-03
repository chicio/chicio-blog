import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Arrays from "../../../content/dsa/arrays.mdx";
import { slugs } from "@/types/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.arrays,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function ArraysPage() {
  return (
    <DsaPage
      slug={slugs.dsa.arrays}
      keywords={["arrays", "array"]}
      description="Data structure and algoritm course. Topic: Array"
      previousTopic={{
        title: "Time and Space Complexity",
        url: slugs.dsa.timeAndSpaceComplexity,
      }}
      nextTopic={{
        title: "Strings",
        url: slugs.dsa.strings,
      }}
    >
      <Arrays />
    </DsaPage>
  );
}
