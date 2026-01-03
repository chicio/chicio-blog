import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Strings from "../../../content/dsa/strings.mdx";
import { slugs } from "@/types/slug";

export default function StringsPage() {
  return (
    <DsaPage
      slug={slugs.dsa.strings}
      keywords={["strings", "string"]}
      description="Data structure and algoritm course. Topic: Strings"    
      previousTopic={{
        title: "Arrays",
        url: slugs.dsa.arrays,
      }}
      nextTopic={{
        title: "Bit manipulation",
        url: slugs.dsa.bitManipulation,
      }}
    >
      <Strings />
    </DsaPage>
  );
}
