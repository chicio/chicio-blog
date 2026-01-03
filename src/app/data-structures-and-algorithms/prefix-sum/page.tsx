import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import PrefixSum from "../../../content/dsa/prefix-sum.mdx";
import { slugs } from "@/types/slug";

export default function PrefixSumPage() {
  return (
    <DsaPage
      previousTopic={{
        title: "Two Pointers",
        url: slugs.dsa.twoPointers,
      }}
      nextTopic={{
        title: "Sliding Window",
        url: slugs.dsa.slidingWindow,
      }}
    >
      <PrefixSum />
    </DsaPage>
  );
}
