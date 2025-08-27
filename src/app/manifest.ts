import type { MetadataRoute } from "next";
import { siteMetadata } from "@/types/site-metadata";
import { blogTheme } from "@/components/design-system/themes/theme";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteMetadata.author,
    short_name: siteMetadata.author,
    description: siteMetadata.title,
    start_url: "/",
    display: "standalone",
    background_color: blogTheme.dark.generalBackground,
    theme_color: blogTheme.dark.generalBackground,
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
