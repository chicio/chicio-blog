"use client";

import { Heading2 } from "@/components/design-system/atoms/heading2";
import { GlassmorphismBackground } from "@/components/design-system/atoms/glassmorphism-background";
import { Paragraph } from "@/components/design-system/atoms/paragraph";
import { BlogPageTemplate } from "@/components/design-system/templates/blog-page-template";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import { ArtGallery } from "./art-gallery";
import styled from "styled-components";

const Container = styled.div`
  margin-top: ${(props) => props.theme.spacing[12]};
`;

export const Art = () => {
  return (
    <BlogPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.art}
    >
      <Container>
        <GlassmorphismBackground>
          <Heading2>Art</Heading2>
          <Paragraph>
            {` My love for everything that is related to visual 👨‍🎨 art/science 👨‍🔬 (tattoo, computer graphics etc.) took me to create this page. A collection of all the draws I created while I'm learning to draw. Keep it in your bookmark to see my drawing skills evolution 🎨 (or follow me on instagram ❤️)`}
          </Paragraph>
        </GlassmorphismBackground>
      </Container>
      <ArtGallery />
    </BlogPageTemplate>
  );
};
