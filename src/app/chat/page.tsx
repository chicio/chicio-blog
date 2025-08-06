import { createMetadata } from "@/lib/seo/seo";
import { Metadata } from "next";
import { siteMetadata } from "@/types/site-metadata";
import { PageTemplate } from "@/components/templates/page-template";
import { tracking } from "@/types/tracking";
import { slugs } from "@/types/slug";
import { Chat } from "@/components/chat/chat";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    author: siteMetadata.author,
    title: siteMetadata.title,
    url: `${siteMetadata.siteUrl}${slugs.tags}`,
    imageUrl: siteMetadata.featuredImage,
    ogPageType: "website",
  });
}

export default function ChatInterface() {
  return (
    <PageTemplate author={''} trackingCategory={tracking.category.chat}>
      <Chat />
    </PageTemplate>
  );
}
