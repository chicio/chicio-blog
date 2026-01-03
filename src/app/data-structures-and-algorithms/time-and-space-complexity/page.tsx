import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import TimeAndSpaceComplexity from "../../../content/dsa/time-and-space-complexity.mdx";
import { slugs } from "@/types/slug";

export default function TimeAndSpaceComplexityPage() {
  return (
    <DsaPage
      nextTopic={{
        title: "Arrays",
        url: slugs.dsa.arrays,
      }}
    >
      <TimeAndSpaceComplexity />
    </DsaPage>
  );
}
