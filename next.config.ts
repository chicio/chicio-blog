import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-gfm",
      "remark-emoji",
      "remark-math",
      "remark-frontmatter",
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
      ["rehype-katex", { strict: 'ignore' }],
      "@microflash/rehype-figure",
    ],
  },
});

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"], 
    minimumCacheTTL: 86400,
  },
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
