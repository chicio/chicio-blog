import { GiscusProps } from "@giscus/react";

// categoryId is a placeholder: fill in with the real GitHub Discussions category id
// (Fabrizio is creating the "Blog comments" category in the GitHub UI) before merging this feature.
export const giscusConfig: Omit<GiscusProps, "id" | "host"> = {
    repo: "chicio/chicio-blog",
    repoId: "R_kgDONo7oFQ",
    category: "Blog comments",
    categoryId: "GISCUS_CATEGORY_ID_PENDING",
    mapping: "pathname",
    strict: "1",
    reactionsEnabled: "1",
    inputPosition: "bottom",
    lang: "en",
    loading: "lazy",
    theme: "https://www.fabrizioduroni.it/giscus-matrix.css",
};
