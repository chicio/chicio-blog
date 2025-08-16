import { createMetadata } from "@/lib/seo/seo";
import { Metadata } from "next";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import { slugs } from "@/types/slug";
import { Chat } from "@/components/chat/components/chat";
import { BasicPageTemplate } from "@/components/templates/basic-page-template";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...createMetadata({
      author: siteMetadata.author,
      title: siteMetadata.title,
      url: `${siteMetadata.siteUrl}${slugs.chat}`,
      imageUrl: siteMetadata.featuredImage,
      ogPageType: "website",
    }),
    robots: { index: false, follow: false },
  };
}

export default function ChatInterface() {
  return (
    <BasicPageTemplate trackingCategory={tracking.category.chat}>
      <Chat />
    </BasicPageTemplate>
  );
}
