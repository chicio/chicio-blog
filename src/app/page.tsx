import { DownArrowIcon } from "@/components/design-system/atoms/icons/down-arrow-icon";
import { MatrixBackground } from "@/components/design-system/molecules/effects/matrix-background";
import { Footer } from "@/components/design-system/organism/footer";
import { Menu } from "@/components/design-system/organism/menu";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { JobsTimeline } from "@/components/sections/home/components/jobs-timeline";
import { ProfilePresentation } from "@/components/sections/home/components/profile-presentation";
import { Projects } from "@/components/sections/home/components/projects";
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
      <Menu trackingCategory={tracking.category.home} />
      <div className="h-screen">
        <MatrixBackground fontSize={16} density={0.95}>
          <ProfilePresentation author={siteMetadata.author} />
        </MatrixBackground>
        <Technologies author={siteMetadata.author} />
        <Projects />
        <JobsTimeline />
        <Footer
          author={siteMetadata.author}
          trackingCategory={tracking.category.home}
        />
        <div className="fixed right-0 bottom-3 left-0 z-40 mx-auto my-0 flex items-center justify-center md:bottom-4">
          <DownArrowIcon trackingCategory={tracking.category.home} />
        </div>
      </div>
      <JsonLd
        ogPageType="website"
        url={siteMetadata.siteUrl}
        imageUrl={siteMetadata.featuredImage}
        title={siteMetadata.title}
      />
    </>
  );
}
