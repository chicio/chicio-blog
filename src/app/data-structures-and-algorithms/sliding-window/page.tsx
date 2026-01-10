import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import SlidingWindow from "../../../content/data-structures-and-algorithms/sliding-window/content.mdx";
import { slugs } from "@/types/configuration/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.slidingWindow,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function SlidingWindowPage() {
  return (
    <DsaPage
      slug={slugs.dsa.slidingWindow}
      keywords={["sliding window", "sliding windows"]}
      description="Data structures and algoritms course. Topic: Sliding Window"    
      previousTopic={{
        title: "Prefix Sum",
        url: slugs.dsa.prefixSum,
      }}
      nextTopic={{
        title: "Kadane's Algorithm",
        url: slugs.dsa.kadaneAlgorithm,
      }}
    >
      <SlidingWindow />
    </DsaPage>
  );
}
