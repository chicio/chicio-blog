"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { SearchablePostFields } from "@/types/post";
import elasticlunr from "elasticlunr";
import { searchIndexFileName } from "@/lib/posts/files";

const hasMinimumCharsToSearch = (query: string): boolean => query.length >= 3;

export const useSearch = (startSearch: boolean) => {
  const [results, setResults] = useState<SearchablePostFields[]>([]);
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

    if (value && hasMinimumCharsToSearch(value) && searchIndex) {
      const results = searchIndex
        .search(value, { expand: true })
        .map((result) => searchIndex.documentStore.getDoc(result.ref));
      setResults(results);
    } else {
      setResults([]);
    }
  };

  return {
    handleSearch,
    results,
  };
};
