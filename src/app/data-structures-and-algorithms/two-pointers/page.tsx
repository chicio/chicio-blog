import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import TwoPointers from "../../../content/dsa/two-pointers.mdx";
import { slugs } from "@/types/slug";

export default function TwoPointersPage() {
  return (
    <DsaPage
      slug={slugs.dsa.twoPointers}
      keywords={["two pointers", "two pointer"]}
      description="Data structure and algoritm course. Topic: Two Pointers"    
      previousTopic={{
        title: "Hash Tables",
        url: slugs.dsa.hashTables,
      }}
      nextTopic={{
        title: "Prefix sum",
        url: slugs.dsa.prefixSum,
      }}
    >
      <TwoPointers />
    </DsaPage>
  );
}
