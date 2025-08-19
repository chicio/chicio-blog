import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import { slugs } from "@/types/slug";
import { BasicPageTemplate } from "@/components/design-system/templates/basic-page-template";
import { Chat } from "@/components/sections/chat/components/chat";

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
    <BasicPageTemplate trackingCategory={tracking.category.chat}>
      <Chat />
    </BasicPageTemplate>
  );
}
