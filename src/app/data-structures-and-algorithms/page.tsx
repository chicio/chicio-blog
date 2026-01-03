import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Roadmap from "../../content/dsa/roadmap.mdx";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";
import { slugs } from "@/types/slug";

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
      description="Data structure and algoritm course. List of all the topics covered."
    >
      <Roadmap />
    </DsaPage>
  );
}
