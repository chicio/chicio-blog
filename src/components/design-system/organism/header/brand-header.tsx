"use client";

import { MatrixHeaderBackground } from "@/components/design-system/molecules/effects/matrix-header-background";
import { FC } from "react";
import styled, { TransientProps } from "styled-components";
import logoImage from "../../../../../public/images/logo.png";
import { GlassmorphismBackground } from "../../atoms/effects/glassmorphism-background";
import { glowText } from "../../atoms/effects/glow";
import { ImageGlow } from "../../atoms/effects/image-glow";
import { mediaQuery } from "../../utils/media-query";
import { Courier_Prime } from 'next/font/google';
import { DejavuEasterEgg } from "@/components/sections/easter-eggs/dejavu";

export const courierPrime = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
});

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

export const BrandHeaderLogo: FC<BlogHeaderProps> = ({ compact = false }) => (
  <DejavuEasterEgg>
    <HeaderContainer $compact={compact}>
      <HeaderGlassWrapper>
        <GlassmorphismBackground>
          <div
            style={{ display: "flex", alignItems: "center", width: "100%" }}
          >
            <ImageGlow
              src={logoImage}
              alt={"blog logo"}
              width={80}
              height={80}
              placeholder={"blur"}
              className="mr-3 object-cover w-[50px] h-[50px] sm:w-[80px] sm:h-[80px]"
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

interface DesktopHeaderProps {
  big: boolean;
}

export const BrandHeader: FC<DesktopHeaderProps> = ({ big }) => (
  <Container $compact={!big}>
    <MatrixHeaderBackground big={big} />
    <BrandHeaderLogo compact={!big} />
  </Container>
);
