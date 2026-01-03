import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Hashtable from "../../../content/dsa/hashtable.mdx";
import { slugs } from "@/types/slug";

export default function HashtablePage() {
  return (
    <DsaPage
      previousTopic={{
        title: "Bit manipulation",
        url: slugs.dsa.bitManipulation,
      }}
      nextTopic={{
        title: "Two Pointers",
        url: slugs.dsa.twoPointers,
      }}
    >
      <Hashtable />
    </DsaPage>
  );
}
