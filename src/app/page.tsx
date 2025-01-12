import {siteMetadata} from "@/types/site-metadata";
import {ShowcasePageTemplate} from "@/components/templates/showcase-page-template";
import {ProfilePresentation} from "@/components/design-system/organism/profile-presentation";
import {tracking} from "@/types/tracking";
import {Technologies} from "@/components/design-system/organism/technologies";
import {Resume} from "@/components/design-system/organism/resume";
import {createStructuredData} from "@/lib/seo";

export default function Home() {
  const author = siteMetadata.author;

  return (
      <>
          <ShowcasePageTemplate
              fullScreenComponent={<ProfilePresentation author={author}/>}
              trackingCategory={tracking.category.home}
          >
              <Technologies author={author}/>
              <Resume/>
          </ShowcasePageTemplate>
          <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{__html: JSON.stringify(createStructuredData({
                      ogPageType: 'website',
                      url: siteMetadata.siteUrl,
                      imageUrl: siteMetadata.featuredImage,
                      author: siteMetadata.author,
                      title: siteMetadata.title,
                      links: siteMetadata.contacts.links,
                  }))}}
          />
      </>
  );
}
