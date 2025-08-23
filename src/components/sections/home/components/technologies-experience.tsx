import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";
import styled from "styled-components";
import { Paragraph } from "@/components/design-system/atoms/typography/paragraph";
import { FC } from "react";
import { SectionTitle } from "./section-title";

const TechExpertiseContainer = styled.div`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing[8]};
`;

const TechnologyParagraph = styled(Paragraph)`
  text-align: center;
  max-width: 800px;
  margin: ${(props) => props.theme.spacing[8]} auto;
`;

export const TechnologiesExperience: FC<{ author: string }> = ({ author }) => (
  <TechExpertiseContainer>
    <SectionTitle>Tech Stack & Expertise</SectionTitle>
    <GlassmorphismBackground>
      <TechnologyParagraph>
        {`I'm ${author}, Experienced Senior Software Engineer with 15+ years in mobile and web development. Passionate about building performant, scalable applications used by millions of users 🚀.`}
      </TechnologyParagraph>
      <TechnologyParagraph>
        {`
  My expertise spans mobile app development, clean architecture, event-driven systems, and full-stack development (Spring Boot, React/React Native, Kubernetes). I’m an OSS contributor and I share technical insights regularly on my blog.`}
      </TechnologyParagraph>
    </GlassmorphismBackground>
  </TechExpertiseContainer>
);
