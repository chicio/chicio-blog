import {siteMetadata} from "@/types/site-metadata";
import {ShowcasePageTemplate} from "@/components/templates/showcase-page-template";
import {ProfilePresentation} from "@/components/design-system/organism/profile-presentation";
import {tracking} from "@/types/tracking";
import {OgPageType} from "@/lib/seo";
import {blogPrimaryColor} from "@/components/design-system/themes/blog-colors";
import {Technologies} from "@/components/design-system/organism/technologies";
import {Resume} from "@/components/design-system/organism/resume";

export default function Home() {
  const author = siteMetadata.author;
  const featuredImage = siteMetadata.featuredImage!;

  return (
      <ShowcasePageTemplate
          location={''}
          fullScreenComponent={<ProfilePresentation author={author} />}
          trackingCategory={tracking.category.home}
          ogPageType={OgPageType.Person}
          featuredImage={featuredImage}
          cookieConsentColor={blogPrimaryColor}
      >
        <Technologies author={author} />
        <Resume />
      </ShowcasePageTemplate>
  );
}
