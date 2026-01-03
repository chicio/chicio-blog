import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Kadane from "../../../content/dsa/kadane-algorithm.mdx";
import { slugs } from "@/types/slug";

export default function KadanePage() {
  return (
    <DsaPage
      previousTopic={{
        title: "Sliding Window",
        url: slugs.dsa.slidingWindow,
      }}
      nextTopic={{
        title: "Matrix (2D Array)",
        url: slugs.dsa.matrix,
      }}
    >
      <Kadane />
    </DsaPage>
  );
}
