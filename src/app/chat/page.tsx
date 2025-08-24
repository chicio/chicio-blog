import { Chat } from "@/components/sections/chat/components/chat";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";
import { slugs } from "@/types/slug";

export const metadata = {
  ...createMetadata({
    author: siteMetadata.author,
    title: siteMetadata.title,
    url: `${siteMetadata.siteUrl}${slugs.chat}`,
    imageUrl: siteMetadata.featuredImage,
    ogPageType: "website",
  }),
  robots: { index: false, follow: false },
};

export default function ChatInterface() {
  return (
      <Chat />
  );
}
