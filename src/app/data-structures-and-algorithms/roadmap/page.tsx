import { Roadmap } from "@/components/sections/data-structures-and-algorithms/components/roadmap";
import { getDataStructuresAndAlgorithmsRoadmap } from "@/lib/content/data-structures-and-algorithms";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dataStructuresAndAlgorithms.roadmap,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default async function RoadmapPage() {
  const roadmap = getDataStructuresAndAlgorithmsRoadmap();

  return <Roadmap roadmap={roadmap} />;
}
