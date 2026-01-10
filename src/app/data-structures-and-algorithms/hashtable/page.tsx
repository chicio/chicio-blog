import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Hashtable from "../../../content/data-structures-and-algorithms/hashtable/content.mdx";
import { slugs } from "@/types/configuration/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.hashTable,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function HashtablePage() {
  return (
    <DsaPage
      slug={slugs.dsa.hashTable}
      keywords={["hash tables", "hash table"]}
      description="Data structures and algoritms course. Topic: Hash Tables"    
      previousTopic={{
        title: "Bit manipulation",
        url: slugs.dsa.bitManipulation,
      }}
      nextTopic={{
        title: "Two Pointers",
        url: slugs.dsa.twoPointers,
      }}
    >
      <Hashtable />
    </DsaPage>
  );
}
