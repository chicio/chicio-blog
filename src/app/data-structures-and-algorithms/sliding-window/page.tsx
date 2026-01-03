import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import SlidingWindow from "../../../content/dsa/sliding-window.mdx";
import { slugs } from "@/types/slug";

export default function SlidingWindowPage() {
  return (
    <DsaPage
      previousTopic={{
        title: "Prefix sum",
        url: slugs.dsa.prefixSum,
      }}
      nextTopic={{
        title: "Kadane's Algorithm",
        url: slugs.dsa.kadaneAlgorithm,
      }}
    >
      <SlidingWindow />
    </DsaPage>
  );
}
