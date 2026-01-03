import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Strings from "../../../content/dsa/strings.mdx";
import { slugs } from "@/types/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.strings,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function StringsPage() {
  return (
    <DsaPage
      slug={slugs.dsa.strings}
      keywords={["strings", "string"]}
      description="Data structure and algoritm course. Topic: Strings"    
      previousTopic={{
        title: "Arrays",
        url: slugs.dsa.arrays,
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
