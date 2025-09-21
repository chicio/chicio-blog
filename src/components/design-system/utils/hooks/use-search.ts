"use client";

import { searchIndexFileName } from "@/lib/posts/files";
import { SearchablePostFields, SearchResult } from "@/types/search";
import elasticlunr from "elasticlunr";
import { ChangeEvent, useEffect, useState, useMemo, useCallback } from "react";
import { debounce } from "@/lib/debounce/debounce";

const hasMinimumCharsToSearch = (query: string): boolean => query.length >= 3;

const searchFor = (
  query: string,
  searchIndex: elasticlunr.Index<SearchablePostFields>,
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
};

export const useSearch = (
  startSearch: boolean,
  easterEgg: (query: string) => SearchResult | null,
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

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (searchIndex) {
          setSearch(searchFor(value, searchIndex));
        } else {
          setSearch({ type: "search", results: [] });
        }
      }, 100),
    [searchIndex],
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
      if (!startSearch) {
        return;
      }

    const value = e.target.value.trim();

    const easterEggResult = easterEgg(value);

    console.log({ easterEggResult });

    if (easterEggResult) {
      setSearch(easterEggResult);
      return;
    }

    debouncedSearch(value);
  };

  const resetSearch = () => setSearch({ type: "search", results: [] });

  return {
    handleSearch,
    resetSearch,
    search,
  };
};
