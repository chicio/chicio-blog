import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import TimeAndSpaceComplexity from "../../../content/dsa/time-and-space-complexity.mdx";
import { slugs } from "@/types/slug";

export default function TimeAndSpaceComplexityPage() {
  return (
    <DsaPage
      slug={slugs.dsa.timeAndSpaceComplexity}
      keywords={["time complexity", "space complexity"]}
      description="Data structure and algoritm course. Topic: Time and Space Complexity"    
      nextTopic={{
        title: "Arrays",
        url: slugs.dsa.arrays,
      }}
    >
      <TimeAndSpaceComplexity />
    </DsaPage>
  );
}
