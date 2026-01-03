import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import TimeAndSpaceComplexity from "../../../content/dsa/time-and-space-complexity.mdx";
import { slugs } from "@/types/slug";

import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.timeAndSpaceComplexity,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function TimeAndSpaceComplexityPage() {
  return (
    <DsaPage
      slug={slugs.dsa.timeAndSpaceComplexity}
      keywords={["time complexity", "space complexity"]}
      description="Data structure and algoritm course. Topic: Time and Space Complexity"    
      nextTopic={{
        title: "Arrays",
        url: slugs.dsa.arrays,
      }}
    >
      <TimeAndSpaceComplexity />
    </DsaPage>
  );
}
