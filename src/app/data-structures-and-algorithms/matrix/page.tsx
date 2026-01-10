import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Matrix from "../../../content/data-structures-and-algorithms/matrix/content.mdx";
import { slugs } from "@/types/configuration/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.matrix,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function MatrixPage() {
  return (
    <DsaPage
      slug={slugs.dsa.matrix}
      keywords={["matrix", "2d array", "2d arrays"]}
      description="Data structures and algoritms course. Topic: Matrix (2D Array)"    
      previousTopic={{
        title: "Kadane's algorithm",
        url: slugs.dsa.kadaneAlgorithm,
      }}
      nextTopic={{
        title: "Linked List",
        url: slugs.dsa.linkedList,
      }}
    >
      <Matrix />
    </DsaPage>
  );
}
