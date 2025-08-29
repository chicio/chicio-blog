import { DownArrowButton } from "@/components/design-system/molecules/buttons/down-arrow-button";
import { MatrixBackground } from "@/components/design-system/molecules/effects/matrix-background";
import { Footer } from "@/components/design-system/organism/footer";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { JobsTimeline } from "@/components/sections/home/components/jobs-timeline";
import { ProfilePresentation } from "@/components/sections/home/components/profile-presentation";
import { Projects } from "@/components/sections/home/components/projects";
import { SnapScrollContainer } from "@/components/sections/home/components/snap-scroll-container";
import { Technologies } from "@/components/sections/home/components/technologies";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";
import { slugs } from "@/types/slug";
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
      <SnapScrollContainer data-snap-container="true">
        <MatrixBackground fontSize={16} speed={50} density={0.95}>
          <ProfilePresentation author={siteMetadata.author} />
        </MatrixBackground>
        <Technologies author={siteMetadata.author} />
        <Projects />
        <JobsTimeline />
        <Footer
          author={siteMetadata.author}
          trackingCategory={tracking.category.home}
        />
        <DownArrowButton />
      </SnapScrollContainer>
      <JsonLd
        ogPageType="website"
        url={siteMetadata.siteUrl}
        imageUrl={siteMetadata.featuredImage}
        title={siteMetadata.title}
      />
    </>
  );
}
