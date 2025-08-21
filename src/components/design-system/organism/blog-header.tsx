"use client";

import { FC } from "react";
import styled from "styled-components";
import { mediaQuery } from "../utils/media-query";
import { MatrixRain } from "../atoms/matrix-rain";
import { GlassmorphismBackground } from "../atoms/glassmorphism-background";
import blogLogoImage from "../../../../public/images/blog-logo.jpg";
import { ImageGlow } from "../atoms/image-glow";
import { glowText } from "../atoms/glow";

const BlogHeaderGlassWrapper = styled.div`
  width: 100%;
`;

const MatrixBackground = styled.div<{ $big: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${(props) => (props.$big ? "350px" : "220px")};
  z-index: -100;
  overflow: hidden;

  border-bottom: 2px solid ${(props) => props.theme.dark.accentColor};
  box-shadow:
    0 4px 20px ${(props) => props.theme.dark.accentColor}1A,
    inset 0 -1px 0 ${(props) => props.theme.dark.accentColor}33,
    0 0 30px ${(props) => props.theme.dark.accentColor}26;

  ${mediaQuery.minWidth.sm} {
    height: ${(props) => (props.$big ? "400px" : "230px")};
  }

  ${mediaQuery.minWidth.md} {
    height: ${(props) => (props.$big ? "500px" : "250px")};
  }
`;

const MatrixBackgroundRain = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
`;

const BlogHeaderContainer = styled.div<{ $compact?: boolean }>`
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

const Container = styled.div`
  display: block;
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

export const BlogHeader: FC<DesktopHeaderProps> = ({ big }) => (
  <Container>
    <BlogHeaderLogo compact={!big} />
    <MatrixBackground $big={big}>
      <MatrixBackgroundRain>
        <MatrixRain fontSize={14} speed={60} density={0.8} />
      </MatrixBackgroundRain>
    </MatrixBackground>
  </Container>
);
