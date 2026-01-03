import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import LinkedList from "../../../content/dsa/linked-list.mdx";
import { slugs } from "@/types/slug";

export default function LinkedListPage() {
  return (
    <DsaPage
      slug={slugs.dsa.linkedList}
      keywords={["linked list", "linked lists"]}
      description="Data structure and algoritm course. Topic: Linked List"    
      previousTopic={{
        title: "Matrix (2D Array)",
        url: slugs.dsa.matrix,
      }}
    >
      <LinkedList />
    </DsaPage>
  );
}
