import type { GiscusProps } from "@giscus/react";

export const giscusConfig: Omit<GiscusProps, "id" | "host"> = {
    repo: "chicio/chicio-blog",
    repoId: "R_kgDONo7oFQ",
    category: "Blog comments",
    categoryId: "DIC_kwDONo7oFc4DBaAT",
    mapping: "pathname",
    strict: "1",
    reactionsEnabled: "1",
    inputPosition: "bottom",
    lang: "en",
    loading: "lazy",
    theme: "https://www.fabrizioduroni.it/giscus-matrix.css",
};
