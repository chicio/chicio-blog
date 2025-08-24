"use client";

import { MatrixHeaderBackground } from "@/components/design-system/molecules/effects/matrix-header-background";
import { FC } from "react";
import styled, { TransientProps } from "styled-components";
import blogLogoImage from "../../../../../public/images/blog-logo.jpg";
import { GlassmorphismBackground } from "../../atoms/effects/glassmorphism-background";
import { glowText } from "../../atoms/effects/glow";
import { ImageGlow } from "../../atoms/effects/image-glow";
import { mediaQuery } from "../../utils/media-query";

const BlogHeaderGlassWrapper = styled.div`
  width: 100%;
`;

const BlogHeaderContainer = styled.div<TransientProps<BlogHeaderProps>>`
  display: flex;
  align-items: center;

  margin-top: ${(props) =>
    props.$compact ? props.theme.spacing[3] : props.theme.spacing[6]};
  margin-bottom: ${(props) =>
    props.$compact ? props.theme.spacing[3] : props.theme.spacing[6]};
`;

const BlogHeaderColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BlogTitle = styled.span`
  color: ${(props) => props.theme.dark.accentColor};
  margin: 0;
  display: block;
  line-height: 1.2;
  font-size: ${(props) => props.theme.fontSizes[4]};
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: ${(props) => props.theme.fontSizes[6]};
  ${glowText};

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[9]};
  }
`;

const BlogDescriptionContainer = styled.div`
  display: block;
  overflow: hidden;
  margin-top: ${(props) => props.theme.spacing[2]};
`;

const BlogDescription = styled.span`
  display: block;
  font-size: ${(props) => props.theme.fontSizes[2]};
  color: ${(props) => props.theme.dark.primaryTextColor};
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: 0.25px;
  ${glowText};

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[4]};
  }
`;

const BlogHeaderImage = styled(ImageGlow)`
  margin-right: ${(props) => props.theme.spacing[2]};
  object-fit: cover;
`;

const Container = styled.div<TransientProps<BlogHeaderProps>>`
  display: block;

  height: ${(props) => (props.$compact ? "150px" : "auto")};
  ${mediaQuery.minWidth.md} {
    height: ${(props) => (props.$compact ? "180px" : "auto")};
  }
`;

interface BlogHeaderProps {
  compact?: boolean;
}

export const BlogHeaderLogo: FC<BlogHeaderProps> = ({ compact = false }) => (
  <BlogHeaderContainer $compact={compact}>
    <BlogHeaderGlassWrapper>
      <GlassmorphismBackground>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <BlogHeaderImage
            src={blogLogoImage}
            alt={"blog logo"}
            width={80}
            height={80}
            placeholder={"blur"}
          />
          <BlogHeaderColumn>
            <BlogTitle>CHICIO CODING</BlogTitle>
            <BlogDescriptionContainer>
              <BlogDescription>Coding. Drawing. Fun.</BlogDescription>
            </BlogDescriptionContainer>
          </BlogHeaderColumn>
        </div>
      </GlassmorphismBackground>
    </BlogHeaderGlassWrapper>
  </BlogHeaderContainer>
);

interface DesktopHeaderProps {
  big: boolean;
}

export const BrandHeader: FC<DesktopHeaderProps> = ({ big }) => (
  <Container $compact={!big}>
    <BlogHeaderLogo compact={!big} />
    <MatrixHeaderBackground big={big} />
  </Container>
);
