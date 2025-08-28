'use client'

import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";
import { Heading2 } from "@/components/design-system/atoms/typography/heading2";
import { Paragraph } from "@/components/design-system/atoms/typography/paragraph";
import { FC } from "react";
import styled from "styled-components";

export const Container = styled.div`
  margin-top: ${(props) => props.theme.spacing[12]};
`;

export const ArtHeader: FC = () => (
  <Container>
    <GlassmorphismBackground>
      <Heading2>Art</Heading2>
      <Paragraph>
        {` My love for everything that is related to visual 👨‍🎨 art/science 👨‍🔬 (tattoo, computer graphics etc.) took me to create this page. A collection of all the draws I created while I'm learning to draw. Keep it in your bookmark to see my drawing skills evolution 🎨 (or follow me on instagram ❤️)`}
      </Paragraph>
    </GlassmorphismBackground>
  </Container>
);
