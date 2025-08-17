import { siteMetadata } from "@/types/site-metadata";
import { ProfilePresentation } from "@/components/home/components/profile-presentation";
import { Technologies } from "@/components/home/components/technologies";
import { JobsTimeline } from "@/components/home/components/jobs-timeline";
import { createMetadata } from "@/lib/seo/seo";
import { slugs } from "@/types/slug";
import { JsonLd } from "@/components/design-system/website/jsond-ld";
import { FloatingDownArrow } from "@/components/design-system/molecules/floating-down-arrow";
import { Footer } from "@/components/design-system/organism/footer";
import { FloatingChatButton } from "@/components/design-system/molecules/floating-chat-button";
import { tracking } from "@/types/tracking";
import { MatrixBackground } from "@/components/design-system/molecules/matrix-background";
import { SnapScrollContainer } from "@/components/home/components/snap-scroll-container";
import { Projects } from "@/components/home/components/projects";

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
      <SnapScrollContainer data-snap-container="true">
        <MatrixBackground fontSize={16} speed={50} density={0.95}>
          <ProfilePresentation author={siteMetadata.author} />
          <FloatingDownArrow />
        </MatrixBackground>
        <Technologies author={siteMetadata.author} />
        <Projects />
        <JobsTimeline />
        <Footer
          author={siteMetadata.author}
          trackingCategory={tracking.category.home}
        />
      </SnapScrollContainer>
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
