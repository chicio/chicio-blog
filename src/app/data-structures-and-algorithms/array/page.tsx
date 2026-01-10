import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Arrays from "../../../content/data-structures-and-algorithms/array/content.mdx";
import { slugs } from "@/types/configuration/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.array,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function ArraysPage() {
  return (
    <DsaPage
      slug={slugs.dsa.array}
      keywords={["arrays", "array"]}
      description="Data structures and algoritms course. Topic: Array"
      previousTopic={{
        title: "Time and Space Complexity",
        url: slugs.dsa.timeAndSpaceComplexity,
      }}
      nextTopic={{
        title: "Strings",
        url: slugs.dsa.string,
      }}
    >
      <Arrays />
    </DsaPage>
  );
}
