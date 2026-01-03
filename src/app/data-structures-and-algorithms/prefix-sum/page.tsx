import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import PrefixSum from "../../../content/dsa/prefix-sum.mdx";
import { slugs } from "@/types/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";

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
      description="Data structure and algoritm course. Topic: Prefix Sum"    
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
