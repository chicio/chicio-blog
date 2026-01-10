import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import PrefixSum from "../../../content/data-structures-and-algorithms/prefix-sum/content.mdx";
import { slugs } from "@/types/configuration/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.prefixSum,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function PrefixSumPage() {
  return (
    <DsaPage
      slug={slugs.dsa.prefixSum}
      keywords={["prefix sum", "prefix sums"]}
      description="Data structures and algoritms course. Topic: Prefix Sum"    
      previousTopic={{
        title: "Two Pointers",
        url: slugs.dsa.twoPointers,
      }}
      nextTopic={{
        title: "Sliding Window",
        url: slugs.dsa.slidingWindow,
      }}
    >
      <PrefixSum />
    </DsaPage>
  );
}
