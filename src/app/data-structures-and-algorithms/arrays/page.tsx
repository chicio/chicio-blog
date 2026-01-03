import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Arrays from "../../../content/dsa/arrays.mdx";
import { slugs } from "@/types/slug";

export default function ArraysPage() {
  return (
    <DsaPage
      slug={slugs.dsa.arrays}
      keywords={["arrays", "array"]}
      description="Data structure and algoritm course. Topic: Array"
      previousTopic={{
        title: "Time and Space Complexity",
        url: slugs.dsa.timeAndSpaceComplexity,
      }}
      nextTopic={{
        title: "Strings",
        url: slugs.dsa.strings,
      }}
    >
      <Arrays />
    </DsaPage>
  );
}
