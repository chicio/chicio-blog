import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Hashtable from "../../../content/dsa/hashtable.mdx";
import { slugs } from "@/types/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.hashTables,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function HashtablePage() {
  return (
    <DsaPage
      slug={slugs.dsa.hashTables}
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
