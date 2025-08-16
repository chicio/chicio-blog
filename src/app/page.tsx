import { siteMetadata } from "@/types/site-metadata";
import { ProfilePresentation } from "@/components/home/components/profile-presentation";
import { Technologies } from "@/components/design-system/organism/technologies";
import { Resume } from "@/components/design-system/organism/resume";
import { createMetadata } from "@/lib/seo/seo";
import { slugs } from "@/types/slug";
import { JsonLd } from "@/components/design-system/website/jsond-ld";
import { FloatingDownArrow } from "@/components/design-system/molecules/floating-down-arrow";
import { Footer } from "@/components/design-system/organism/footer";
import { FloatingChatButton } from "@/components/design-system/molecules/floating-chat-button";
import { tracking } from "@/types/tracking";
import { MatrixBackground } from "@/components/design-system/molecules/matrix-background";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  url: `${siteMetadata.siteUrl}${slugs.blog}`,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function Home() {
  return (
    <>
      <MatrixBackground fontSize={16} speed={50} density={0.95}>
        <ProfilePresentation author={siteMetadata.author} />
        <FloatingDownArrow />
      </MatrixBackground>
      <Technologies author={siteMetadata.author} />
      <Resume />
      <Footer
        author={siteMetadata.author}
        trackingCategory={tracking.category.home}
      />
      <FloatingChatButton />
      <JsonLd
        ogPageType="website"
        url={siteMetadata.siteUrl}
        imageUrl={siteMetadata.featuredImage}
        title={siteMetadata.title}
      />
    </>
  );
}
