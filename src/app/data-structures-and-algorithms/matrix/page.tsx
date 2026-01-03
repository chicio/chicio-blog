import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Matrix from "../../../content/dsa/matrix.mdx";
import { slugs } from "@/types/slug";

export default function MatrixPage() {
  return (
    <DsaPage
      slug={slugs.dsa.matrix}
      keywords={["matrix", "2d array", "2d arrays"]}
      description="Data structure and algoritm course. Topic: Matrix (2D Array)"    
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
