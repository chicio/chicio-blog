import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import LinkedList from "../../../content/dsa/linked-list.mdx";
import { slugs } from "@/types/slug";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";

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
    >
      <LinkedList />
    </DsaPage>
  );
}
