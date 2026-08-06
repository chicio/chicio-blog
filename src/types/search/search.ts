export type SearchablePostFields = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  authors: string[];
};

export type SearchResult = { type: "search"; results: SearchablePostFields[] };