import type { MetadataRoute } from "next";
import { siteMetadata } from "@/types/configuration/site-metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteMetadata.author,
    short_name: siteMetadata.author,
    description: siteMetadata.title,
    start_url: "/",
    display: "standalone",
    background_color: '#001100',
    theme_color: '#001100',
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
    ],
  };
}
