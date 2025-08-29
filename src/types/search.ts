export type EasterEggTerminalLines = {
    text: string;
    type?: "normal" | "quote";
    delay?: number;
  }[]

export type EasterEggSearchResult = {
  type: "easterEgg";
  terminalLines: EasterEggTerminalLines;
};

export type SearchablePostFields = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  authors: string[];
};

export type PostSearchResult = { type: "search"; results: SearchablePostFields[] };

export type SearchResult =
  | PostSearchResult
  | EasterEggSearchResult;