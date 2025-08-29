"use client";

import { MatrixHeaderBackground } from "@/components/design-system/molecules/effects/matrix-header-background";
import { FC, useEffect, useState } from "react";
import styled, { TransientProps } from "styled-components";
import logoImage from "../../../../../public/images/logo.png";
import { GlassmorphismBackground } from "../../atoms/effects/glassmorphism-background";
import { glowText } from "../../atoms/effects/glow";
import { ImageGlow } from "../../atoms/effects/image-glow";
import { mediaQuery } from "../../utils/media-query";
import { DejavuEasterEgg } from "../../utils/easter-eggs/dejavu";

const HeaderGlassWrapper = styled.div`
  width: 100%;
`;

const HeaderContainer = styled.div<TransientProps<BlogHeaderProps>>`
  display: flex;
  align-items: center;

  margin-top: ${(props) =>
    props.$compact ? props.theme.spacing[3] : props.theme.spacing[6]};
  margin-bottom: ${(props) =>
    props.$compact ? props.theme.spacing[3] : props.theme.spacing[6]};
`;

const HeaderColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.span`
  color: ${(props) => props.theme.colors.accentColor};
  margin: 0;
  display: block;
  font-family: "Courier Prime";
  font-size: ${(props) => props.theme.fontSizes[3]};
  font-weight: bold;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: ${(props) => props.theme.fontSizes[6]};
  text-shadow:
    0 0 10px ${(props) => props.theme.colors.accentColor},
    0 0 20px ${(props) => props.theme.colors.primaryColorDark}A0,
    0 0 30px ${(props) => props.theme.colors.accentColor}50;

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[9]};
  }
`;

const SloganContainer = styled.div`
  display: block;
  overflow: hidden;
  margin-top: ${(props) => props.theme.spacing[1]};
`;

const Slogan = styled.span`
  ${glowText};
  display: block;
  font-size: ${(props) => props.theme.fontSizes[1]};
  font-family: "Courier Prime";
  color: ${(props) => props.theme.colors.primaryTextColor};
  font-weight: normal;

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[4]};
  }
`;

const BrandHeaderImage = styled(ImageGlow)`
  margin-right: ${(props) => props.theme.spacing[2]};
  object-fit: cover;
  width: 50px;
  height: 50px;

  ${mediaQuery.minWidth.sm} {
    width: 80px;
    height: 80px;
  }
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

export const BrandHeaderLogo: FC<BlogHeaderProps> = ({ compact = false }) => {
  const [logoClicks, setLogoClicks] = useState(0);
  const [showDejavu, setShowDejavu] = useState(false);

  useEffect(() => {
    if (logoClicks === 4) {
      document.body.classList.add("glitch-active");
      const glitchTimeout = setTimeout(() => {
        document.body.classList.remove("glitch-active");
        setShowDejavu(true);
      }, 400);
      const resetTimeout = setTimeout(() => {
        setShowDejavu(false);
        setLogoClicks(0);
      }, 4000);
      return () => {
        clearTimeout(glitchTimeout);
        clearTimeout(resetTimeout);
      };
    }
  }, [logoClicks]);

  const handleLogoClick = () => {
    setLogoClicks((prev) => prev + 1);
  };

  return (
    <DejavuEasterEgg>
      <HeaderContainer $compact={compact}>
        <HeaderGlassWrapper>
          <GlassmorphismBackground>
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <BrandHeaderImage
                src={logoImage}
                alt={"blog logo"}
                width={80}
                height={80}
                placeholder={"blur"}
                onClick={handleLogoClick}
                style={{ cursor: "pointer" }}
              />
              <HeaderColumn>
                <Title>CHICIO CODING</Title>
                <SloganContainer>
                  <Slogan>Pixels. Code. Unplugged.</Slogan>
                </SloganContainer>
              </HeaderColumn>
            </div>
          </GlassmorphismBackground>
        </HeaderGlassWrapper>
      </HeaderContainer>
    </DejavuEasterEgg>
  );
};

interface DesktopHeaderProps {
  big: boolean;
}

export const BrandHeader: FC<DesktopHeaderProps> = ({ big }) => (
  <Container $compact={!big}>
    <BrandHeaderLogo compact={!big} />
    <MatrixHeaderBackground big={big} />
  </Container>
);
