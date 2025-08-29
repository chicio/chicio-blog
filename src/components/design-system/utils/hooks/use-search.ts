"use client";

import { searchIndexFileName } from "@/lib/posts/files";
import { SearchablePostFields, SearchResult } from "@/types/search";
import elasticlunr from "elasticlunr";
import { ChangeEvent, useEffect, useState } from "react";

const hasMinimumCharsToSearch = (query: string): boolean => query.length >= 3;

const searchFor = (
  query: string,
  searchIndex: elasticlunr.Index<SearchablePostFields>
): SearchResult => {
  if (query && hasMinimumCharsToSearch(query) && searchIndex) {
    return {
      type: "search",
      results: searchIndex
        .search(query, { expand: true })
        .map((result) => searchIndex.documentStore.getDoc(result.ref)),
    };
  }
  return { type: "search", results: [] };
}

export const useSearch = (
  startSearch: boolean,
  easterEgg: (query: string) => SearchResult | null
) => {
  const [search, setSearch] = useState<SearchResult>({
    type: "search",
    results: [],
  });
  const [searchIndex, setSearchIndex] =
    useState<elasticlunr.Index<SearchablePostFields>>();

  useEffect(() => {
    fetch(`/${searchIndexFileName}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchIndex(elasticlunr.Index.load<SearchablePostFields>(data));
      });
  }, []);

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!startSearch) {
      return;
    }

    const value = e.target.value.trim();

    const easterEggResult = easterEgg(value);
    
    if (easterEggResult) {
      setSearch(easterEggResult);
      return;
    }

    if (searchIndex) {
      setSearch(searchFor(value, searchIndex));
    } else {
      setSearch({ type: "search", results: [] });
    }
  };

  const resetSearch = () => setSearch({ type: "search", results: [] });

  return {
    handleSearch,
    resetSearch,
    search,
  };
};
