import { BlogPageTemplate } from "@/components/templates/blog-page-template";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import { ArtGallery } from "@/components/design-system/organism/art-gallery";
import { Paragraph } from "@/components/design-system/atoms/paragraph";
import { Heading2 } from "@/components/design-system/atoms/heading2";
import {ContentContainer} from "@/components/website/content-container";

export default async function ArtPage() {
  return (
    <BlogPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.art}
    >
      <Heading2>Art</Heading2>
      <Paragraph>
        {` My love for everything that is related to visual 👨‍🎨 art/science 👨‍🔬 (tattoo, computer graphics etc.) took me to create this page. A collection of all the draws I created while I'm learning to draw. Keep it in your bookmark to see my drawing skills evolution 🎨 (or follow me on instagram ❤️)`}
      </Paragraph>
      <ContentContainer>
        <ArtGallery />
      </ContentContainer>
    </BlogPageTemplate>
  );
}
