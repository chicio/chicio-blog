import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import BitManipulation from "../../../content/dsa/bit-manipulation.mdx";
import { slugs } from "@/types/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.bitManipulation,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function BitManipulationPage() {
  return (
    <DsaPage
      slug={slugs.dsa.bitManipulation}
      keywords={["bit manipulation", "bits"]}
      description="Data structure and algoritm course. Topic: Bit Manipulation"
      previousTopic={{
        title: "Strings",
        url: slugs.dsa.strings,
      }}
      nextTopic={{
        title: "Hash Tables",
        url: slugs.dsa.hashTables,
      }}
    >
      <BitManipulation />
    </DsaPage>
  );
}
