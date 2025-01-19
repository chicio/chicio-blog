import { NextRequest, NextResponse } from "next/server";
import elasticlunr from "elasticlunr";
import { SearchablePostFields } from "@/types/post";
import path from "path";
import fs from "fs";
import {searchIndexFileName} from "@/lib/search";

let searchIndex: elasticlunr.Index<SearchablePostFields>;

const loadSearchIndex = () => {
  if (!searchIndex) {
    const indexPath = path.join(process.cwd(), "public", searchIndexFileName);
    const indexData = fs.readFileSync(indexPath, "utf8");
    searchIndex = elasticlunr.Index.load(JSON.parse(indexData));
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  loadSearchIndex();

  if (!query) {
    return NextResponse.json(
      { error: "Missing query parameter" },
      { status: 400 },
    );
  }

  const results = searchIndex
    .search(query, { expand: true })
    .map((result) => searchIndex.documentStore.getDoc(result.ref));

  return NextResponse.json({ results });
}
