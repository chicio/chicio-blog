import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import Hashtable from "../../../content/dsa/hashtable.mdx";
import { slugs } from "@/types/slug";

export default function HashtablePage() {
  return (
    <DsaPage
      slug={slugs.dsa.hashTables}
      keywords={["hash tables", "hash table"]}
      description="Data structure and algoritm course. Topic: Hash Tables"    
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
