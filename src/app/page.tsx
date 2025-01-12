import {siteMetadata} from "@/types/site-metadata";
import {ShowcasePageTemplate} from "@/components/templates/showcase-page-template";
import {ProfilePresentation} from "@/components/design-system/organism/profile-presentation";
import {tracking} from "@/types/tracking";
import {Technologies} from "@/components/design-system/organism/technologies";
import {Resume} from "@/components/design-system/organism/resume";

export default function Home() {
  const author = siteMetadata.author;
  const featuredImage = siteMetadata.featuredImage!;

  return (
      <>
      <ShowcasePageTemplate
          fullScreenComponent={<ProfilePresentation author={author} />}
          trackingCategory={tracking.category.home}
          ogPageType={'profile'}
          featuredImage={featuredImage}
      >
        <Technologies author={author} />
        <Resume />
      </ShowcasePageTemplate>
      </>
  );
}
