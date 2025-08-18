'use client'

import { FC } from "react";
import styled from "styled-components";
import { mediaQuery } from "../utils-css/media-query";
import { MatrixRain } from "../atoms/matrix-rain";
import Image from "next/image";
import blogLogoImage from '../../../../public/images/blog-logo.jpg';

// ===== MATRIX DESKTOP COMPONENTS =====
const BlogHeaderGlass = styled.div`
  position: relative;
  z-index: 2;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.dark.accentColor}40;
  padding: ${(props) => props.theme.spacing[2]};
  width: 100%;
  box-shadow:
    0 8px 32px ${(props) => props.theme.dark.boxShadowLight},
    inset 0 1px 0 ${(props) => props.theme.dark.accentColor}1A;

  ${mediaQuery.minWidth.md} {
    padding: ${(props) => props.theme.spacing[3]};
  }
`;

const MatrixBackground = styled.div<{ $big: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${(props) => (props.$big ? "400px" : "220px")};
  z-index: -100;
  overflow: hidden;
`;

const MatrixBackgroundRain = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
`;

// ===== LEGACY COMPONENTS (manteniamo per compatibilità) =====
const BlogHeaderContainer = styled.div<{ $compact?: boolean }>`
  display: flex;
  align-items: center;

  ${mediaQuery.minWidth.sm} {
    margin-top: ${(props) => props.$compact ? props.theme.spacing[3] : props.theme.spacing[6]};
    margin-bottom: ${(props) => props.$compact ? props.theme.spacing[3] : props.theme.spacing[6]};
  }
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
  
  /* Matrix glow effect */
  text-shadow: 
    0 0 5px ${(props) => props.theme.dark.accentColor}80,
    0 0 10px ${(props) => props.theme.dark.accentColor}40;

  ${mediaQuery.minWidth.xs} {
    font-size: ${(props) => props.theme.fontSizes[6]};
  }

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[9]};
  }
`;

const BlogDescriptionContainer = styled.div`
  display: none;
  overflow: hidden;
  margin-top: ${(props) => props.theme.spacing[2]};

  ${mediaQuery.minWidth.sm} {
    display: block;
  }
`;

const BlogDescription = styled.span`
  display: none;

  ${mediaQuery.minWidth.sm} {
    display: block;
    font-size: ${(props) => props.theme.fontSizes[4]};
    color: ${(props) => props.theme.dark.primaryTextColor};
    line-height: 1.5;
    font-weight: 400;
    letter-spacing: 0.25px;
    opacity: 0.9;
    
    /* Subtle glow for description */
    text-shadow: 0 0 3px ${(props) => props.theme.dark.accentColor}20;
  }
`;

const BlogHeaderImage = styled(Image)`
  width: 35px;
  height: 35px;
  margin-right: ${(props) => props.theme.spacing[2]};
  border-radius: 12px;
  object-fit: cover;
  
  /* Matrix glow effect */
  box-shadow: 
    0 0 10px ${(props) => props.theme.dark.accentColor}33,
    inset 0 1px 0 ${(props) => props.theme.dark.accentColor}1A;
  border: 1px solid ${(props) => props.theme.dark.accentColor}40;
  
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  ${mediaQuery.minWidth.sm} {
    width: 80px;
    height: 80px;
  }

  ${mediaQuery.inputDevice.mouse} {
    &:hover {
      transform: scale(1.03) translateY(-2px);
      box-shadow:
        0 0 15px ${(props) => props.theme.dark.accentColor}99,
        0 0 25px ${(props) => props.theme.dark.accentColor}66,
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
      border-color: ${(props) => props.theme.dark.accentColor}80;
    }
  }
`;

const DesktopContainer = styled.div`
  display: none;

  ${mediaQuery.minWidth.sm} {
      display: block;
  }
`;

interface MobileContainerProps {
  height: string;
}

// Mobile Matrix styling per header compatto nel menu
const MobileMatrixContainer = styled.div<MobileContainerProps>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: ${(props) => props.height};
  width: 100%;
  padding: 0 ${(props) => props.theme.spacing[2]};
  background: ${(props) => props.theme.dark.primaryColorDark};
  gap: ${(props) => props.theme.spacing[2]};

  ${mediaQuery.minWidth.sm} {
    display: none;
  }

  /* Override per dimensioni compatte nel menu */
  ${BlogHeaderImage} {
    width: 32px;
    height: 32px;
    margin-right: ${(props) => props.theme.spacing[2]};
  }

  ${BlogTitle} {
    font-size: ${(props) => props.theme.fontSizes[3]};
    margin: 0;
    line-height: 1.2;
  }

  /* Nascondi descrizione nel menu mobile */
  ${BlogDescriptionContainer} {
    display: none;
  }
`;

// ===== EXPORT COMPONENTS =====
interface BlogHeaderProps {
  compact?: boolean;
}

export const BlogHeader: FC<BlogHeaderProps> = ({ compact = false }) => (
  <BlogHeaderContainer $compact={compact}>
    <BlogHeaderGlass>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
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
    </BlogHeaderGlass>
  </BlogHeaderContainer>
);

interface DesktopHeaderProps {
  big: boolean;
}

export const DesktopBlogHeader: FC<DesktopHeaderProps> = ({ big }) => (
  <DesktopContainer>
    <BlogHeader compact={!big} />
    <MatrixBackground $big={big}>
      <MatrixBackgroundRain>
        <MatrixRain fontSize={14} speed={60} density={0.8} />
      </MatrixBackgroundRain>
    </MatrixBackground>
  </DesktopContainer>
);

export const MobileBlogHeader: FC<MobileContainerProps> = ({ height }) => (
  <MobileMatrixContainer height={height}>
    <BlogHeaderImage
      src={blogLogoImage}
      alt={"blog logo"}
      width={32}
      height={32}
      placeholder={"blur"}
    />
    <BlogHeaderColumn>
      <BlogTitle>CHICIO CODING</BlogTitle>
      <BlogDescriptionContainer>
        <BlogDescription>Coding. Drawing. Fun.</BlogDescription>
      </BlogDescriptionContainer>
    </BlogHeaderColumn>
  </MobileMatrixContainer>
);
