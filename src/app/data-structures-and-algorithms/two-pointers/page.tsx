import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import TwoPointers from "../../../content/dsa/two-pointers.mdx";
import { slugs } from "@/types/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.twoPointers,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function TwoPointersPage() {
  return (
    <DsaPage
      slug={slugs.dsa.twoPointers}
      keywords={["two pointers", "two pointer"]}
      description="Data structures and algoritms course. Topic: Two Pointers"    
      previousTopic={{
        title: "Hash Tables",
        url: slugs.dsa.hashTables,
      }}
      nextTopic={{
        title: "Prefix sum",
        url: slugs.dsa.prefixSum,
      }}
    >
      <TwoPointers />
    </DsaPage>
  );
}
