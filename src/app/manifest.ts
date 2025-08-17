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
    background_color: blogTheme.dark.primaryColorDark,
    theme_color: blogTheme.dark.primaryColorDark,
    icons: [
      {
        src: "/icon4.png",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
