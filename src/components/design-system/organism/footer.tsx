'use client'

import { FC } from "react";
import { SocialContacts } from "./social-contacts";
import styled from "styled-components";
import { Paragraph } from "../atoms/paragraph";
import { mediaQuery } from "../utils-css/media-query";
import { MenuItemWithTracking } from "@/components/design-system/atoms/menu-item-with-tracking";
import { tracking } from "@/types/tracking";
import { slugs } from "@/types/slug";
import { motion } from "framer-motion";

const FooterContainer = styled.footer`
  flex-shrink: 0;
  width: 100%;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.dark.generalBackgroundLight} 0%,
    ${(props) => props.theme.dark.primaryColorDark} 100%
  );
  border-top: 2px solid ${(props) => props.theme.dark.accentColor};
  scroll-snap-align: start;
  position: relative;
  
  box-shadow: 
    0 -4px 20px ${(props) => props.theme.dark.accentColor}1A,
    inset 0 1px 0 ${(props) => props.theme.dark.accentColor}33;
`;

const FooterContent = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterMenu = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${(props) => props.theme.spacing[2]};
  padding: ${(props) => props.theme.spacing[6]} ${(props) => props.theme.spacing[4]};
  width: 100%;

  ${mediaQuery.minWidth.sm} {
    grid-template-columns: repeat(6, auto);
    justify-content: center;
    max-width: 800px;
    margin: 0 auto;
  }
`;

const FooterMenuItem = styled(MenuItemWithTracking)`
  color: ${(props) => props.theme.dark.primaryTextColor};
  text-decoration: none;
  font-weight: 500;
  font-size: ${(props) => props.theme.fontSizes[1]};
  padding: ${(props) => props.theme.spacing[3]} ${(props) => props.theme.spacing[2]};
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid transparent;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${(props) => props.theme.dark.accentColor};
    background: ${(props) => props.theme.dark.accentColor}1A;
    border-color: ${(props) => props.theme.dark.accentColor};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${(props) => props.theme.dark.accentColor}33;
  }

  ${mediaQuery.minWidth.md} {
    font-size: ${(props) => props.theme.fontSizes[2]};
    padding: ${(props) => props.theme.spacing[3]} ${(props) => props.theme.spacing[3]};
  }

  ${mediaQuery.minWidth.lg} {
    padding: ${(props) => props.theme.spacing[2]} ${(props) => props.theme.spacing[4]};
  }
`;

const FooterContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const FooterAuthorSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing[3]};
  padding: ${(props) => props.theme.spacing[6]} ${(props) => props.theme.spacing[4]};
  width: 100%;
  background: ${(props) => props.theme.dark.primaryColorDark};
  border-top: 1px solid ${(props) => props.theme.dark.accentColor}33;

  ${mediaQuery.minWidth.md} {
    padding: ${(props) => props.theme.spacing[8]} ${(props) => props.theme.spacing[6]};
  }
`;

const MadeWithLoveParagraph = styled(Paragraph)`
  color: ${(props) => props.theme.dark.primaryTextColor};
  font-size: ${(props) => props.theme.fontSizes[1]};
  opacity: 0.9;
  margin: 0;
  text-align: center;

  ${mediaQuery.minWidth.md} {
    font-size: ${(props) => props.theme.fontSizes[2]};
  }
`;

const FooterSeparator = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    ${(props) => props.theme.dark.accentColor},
    transparent
  );
  opacity: 0.4;
`;

export interface FooterProps {
  author: string;
  trackingCategory: string;
}

export const Footer: FC<FooterProps> = ({ author, trackingCategory }) => (
  <FooterContainer>
    <FooterContent
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <FooterContentContainer>
        <FooterMenu
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <FooterMenuItem
            to="/"
            trackingData={{
              action: tracking.action.open_home,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Home
          </FooterMenuItem>
          <FooterMenuItem
            to={slugs.blog}
            trackingData={{
              action: tracking.action.open_blog,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Blog
          </FooterMenuItem>
          <FooterMenuItem
            to={slugs.art}
            trackingData={{
              action: tracking.action.open_art,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Art
          </FooterMenuItem>
          <FooterMenuItem
            to={slugs.aboutMe}
            trackingData={{
              action: tracking.action.open_about_me,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            About Me
          </FooterMenuItem>
          <FooterMenuItem
            to={slugs.blogArchive}
            trackingData={{
              action: tracking.action.open_blog_archive,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Archive
          </FooterMenuItem>
          <FooterMenuItem
            to={slugs.tags}
            trackingData={{
              action: tracking.action.open_blog_tags,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Tags
          </FooterMenuItem>
        </FooterMenu>

        <FooterSeparator />

        <FooterAuthorSection>
          <SocialContacts
            trackingCategory={trackingCategory}
            trackingLabel={tracking.label.footer}
          />
          <MadeWithLoveParagraph>
            {`Made with 💝 by ${author} 'Chicio'`}
          </MadeWithLoveParagraph>
        </FooterAuthorSection>
      </FooterContentContainer>
    </FooterContent>
  </FooterContainer>
);
