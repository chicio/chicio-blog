import type { MetadataRoute } from "next";
import { siteMetadata } from "@/types/configuration/site-metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteMetadata.author,
    short_name: siteMetadata.author,
    description: siteMetadata.title,
    start_url: "/",
    display: "standalone",
    background_color: "#001100",
    theme_color: "#001100",
    lang: "en",
    categories: ["education", "technology", "productivity"],
    icons: [
      {
        src: "/icon1.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon2.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon1.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon2.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Blog",
        short_name: "Blog",
        description: "Read the latest articles on software engineering",
        url: "/blog",
        icons: [{ src: "/icon1.png", sizes: "192x192" }],
      },
      {
        name: "Data Structures & Algorithms",
        short_name: "DSA",
        description: "Explore DSA topics with interactive visualizers",
        url: "/data-structures-and-algorithms",
        icons: [{ src: "/icon1.png", sizes: "192x192" }],
      },
      {
        name: "Chat with Fabrizio",
        short_name: "Chat",
        description: "Ask the AI assistant about my work and projects",
        url: "/chat",
        icons: [{ src: "/icon1.png", sizes: "192x192" }],
      },
      {
        name: "Art",
        short_name: "Art",
        description: "Browse 3D art and generative works",
        url: "/art",
        icons: [{ src: "/icon1.png", sizes: "192x192" }],
      },
    ],
  };
}
