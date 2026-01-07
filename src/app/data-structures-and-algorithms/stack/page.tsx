import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Stack from "../../../content/dsa/stack.mdx";
import { slugs } from "@/types/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.stack,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function StackPage() {
  return (
    <DsaPage
      slug={slugs.dsa.stack}
      keywords={["stacks", "stack"]}
      description="Data structures and algoritms course. Topic: Stack"    
      previousTopic={{
        title: "Linked List",
        url: slugs.dsa.linkedList,
      }}
    >
      <Stack />
    </DsaPage>
  );
}
