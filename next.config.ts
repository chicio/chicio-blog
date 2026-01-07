import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-emoji",
      "remark-gfm",
      "remark-math",
      "remark-rehype",
      "remark-frontmatter",
      "remark-mdx-frontmatter",
    ],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-autolink-headings",
        {
          behavior: "wrap",
          properties: { className: ["heading-anchor"] },
        },
      ],
      "rehype-highlight",
      "rehype-katex",
      "@microflash/rehype-figure",
    ],
  },
});

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:year/:month/:day/:slug.html",
        destination: "/:year/:month/:day/:slug",
        permanent: true,
      },
      {
        source: "/:year/:month/:day/:slug",
        destination: "/blog/post/:year/:month/:day/:slug",
        permanent: true,
      },
    ];
  },
  reactCompiler: true,
};

export default withMDX(nextConfig);
