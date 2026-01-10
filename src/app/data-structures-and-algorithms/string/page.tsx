import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Strings from "../../../content/data-structures-and-algorithms/string/content.mdx";
import { slugs } from "@/types/configuration/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.string,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function StringsPage() {
  return (
    <DsaPage
      slug={slugs.dsa.string}
      keywords={["strings", "string"]}
      description="Data structures and algoritms course. Topic: String"    
      previousTopic={{
        title: "Array",
        url: slugs.dsa.array,
      }}
      nextTopic={{
        title: "Bit manipulation",
        url: slugs.dsa.bitManipulation,
      }}
    >
      <Strings />
    </DsaPage>
  );
}
