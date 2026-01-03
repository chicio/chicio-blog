import { DsaPage } from "@/components/sections/dsa/components/dsa-page";
import BitManipulation from "../../../content/dsa/bit-manipulation.mdx";
import { slugs } from "@/types/slug";

export default function BitManipulationPage() {
  return (
    <DsaPage
      previousTopic={{
        title: "Strings",
        url: slugs.dsa.strings,
      }}
      nextTopic={{
        title: "Hash Tables",
        url: slugs.dsa.hashTables,
      }}
    >
      <BitManipulation />
    </DsaPage>
  );
}
