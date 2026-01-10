import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Roadmap from "../../../content/data-structures-and-algorithms/roadmap/content.mdx";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.roadmap,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function RoadmapPage() {
  return (
    <DsaPage
      slug={slugs.dsa.roadmap}
      keywords={["roadmap", "data structures", "algorithms"]}
      description="Data structures and algoritms course. List of all the topics covered."
    >
      <Roadmap />
    </DsaPage>
  );
}
