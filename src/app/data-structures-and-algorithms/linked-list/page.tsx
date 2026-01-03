import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import LinkedList from "../../../content/dsa/linked-list.mdx";
import { slugs } from "@/types/slug";

export default function LinkedListPage() {
  return (
    <DsaPage
      previousTopic={{
        title: "Matrix (2D Array)",
        url: slugs.dsa.matrix,
      }}
    >
      <LinkedList />
    </DsaPage>
  );
}
