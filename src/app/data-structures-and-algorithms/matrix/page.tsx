import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Matrix from "../../../content/dsa/matrix.mdx";
import { slugs } from "@/types/slug";

export default function MatrixPage() {
  return (
    <DsaPage
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
