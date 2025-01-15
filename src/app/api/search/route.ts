import { NextRequest, NextResponse } from "next/server";
import elasticlunr from "elasticlunr";
import {createSearchIndex} from "@/lib/search";
import {SearchablePostFields} from "@/types/post";

let searchIndex: elasticlunr.Index<SearchablePostFields>;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!searchIndex) {
        searchIndex = createSearchIndex();
    }

    if (!query) {
        return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
    }

    const results = searchIndex
        .search(query, { expand: true })
        .map(result => searchIndex.documentStore.getDoc(result.ref))

    return NextResponse.json({ results });
}
