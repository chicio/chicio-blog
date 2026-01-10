import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Kadane from "../../../content/data-structures-and-algorithms/kadane-algorithm/content.mdx";
import { slugs } from "@/types/configuration/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.kadaneAlgorithm,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function KadanePage() {
  return (
    <DsaPage
      slug={slugs.dsa.kadaneAlgorithm}
      keywords={["kadane", "kadane's algorithm"]}
      description="Data structures and algoritms course. Topic: Kadane's Algorithm"    
      previousTopic={{
        title: "Sliding Window",
        url: slugs.dsa.slidingWindow,
      }}
      nextTopic={{
        title: "Matrix (2D Array)",
        url: slugs.dsa.matrix,
      }}
    >
      <Kadane />
    </DsaPage>
  );
}
