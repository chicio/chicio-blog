import { siteMetadata } from "@/types/site-metadata";
import { ProfilePresentation } from "@/components/design-system/organism/profile-presentation";
import { Technologies } from "@/components/design-system/organism/technologies";
import { Resume } from "@/components/design-system/organism/resume";
import { createMetadata } from "@/lib/seo";
import { slugs } from "@/types/slug";
import { JsonLd } from "@/components/website/jsond-ld";
import { ContainerFullscreen } from "@/components/design-system/atoms/container-fullscreen";
import { DownArrow } from "@/components/design-system/molecules/down-arrow";
import { Footer } from "@/components/design-system/organism/footer";
import { tracking } from "@/types/tracking";

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
      <ContainerFullscreen>
        <ProfilePresentation author={siteMetadata.author} />
        <DownArrow />
      </ContainerFullscreen>
      <Technologies author={siteMetadata.author} />
      <Resume />
      <Footer
        author={siteMetadata.author}
        trackingCategory={tracking.category.home}
      />
      <JsonLd
        ogPageType="website"
        url={siteMetadata.siteUrl}
        imageUrl={siteMetadata.featuredImage}
        title={siteMetadata.title}
      />
    </>
  );
}
