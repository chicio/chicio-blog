import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import LinkedList from "../../../content/data-structures-and-algorithms/linked-list/content.mdx";
import { slugs } from "@/types/configuration/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  description: siteMetadata.description,
  slug: slugs.dsa.linkedList,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function LinkedListPage() {
  return (
    <DsaPage
      slug={slugs.dsa.linkedList}
      keywords={["linked list", "linked lists"]}
      description="Data structures and algoritms course. Topic: Linked List"    
      previousTopic={{
        title: "Matrix (2D Array)",
        url: slugs.dsa.matrix,
      }}
      nextTopic={{
        title: "Stack",
        url: slugs.dsa.stack
      }}
    >
      <LinkedList />
    </DsaPage>
  );
}
