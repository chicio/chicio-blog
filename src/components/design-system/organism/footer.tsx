'use client'

import { FC } from "react";
import { SocialContacts } from "./social-contacts";
import styled from "styled-components";
import { Paragraph } from "../atoms/typography/paragraph";
import { mediaQuery } from "../utils/media-query";
import { MatrixMenuItem } from "../molecules/menu/matrix-menu-item";
import { tracking } from "@/types/tracking";
import { slugs } from "@/types/slug";
import { motion } from "framer-motion";
import { FadeSeparator } from "../atoms/effects/fade-separator";

const FooterContainer = styled.footer`
  flex-shrink: 0;
  width: 100%;
  background: ${(props) => props.theme.colors.primaryColorDark};
  border-top: 2px solid ${(props) => props.theme.colors.accentColor};
  scroll-snap-align: start;
  position: relative;
  
  box-shadow: 
    0 -4px 20px ${(props) => props.theme.colors.accentColor}1A,
    inset 0 1px 0 ${(props) => props.theme.colors.accentColor}33;
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
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.generalBackgroundLight} 0%,
    ${(props) => props.theme.colors.primaryColorDark} 100%
  );
  border-top: 1px solid ${(props) => props.theme.colors.accentColor}33;

  ${mediaQuery.minWidth.md} {
    padding: ${(props) => props.theme.spacing[8]} ${(props) => props.theme.spacing[6]};
  }
`;

const MadeWithLoveParagraph = styled(Paragraph)`
  color: ${(props) => props.theme.colors.primaryTextColor};
  font-size: ${(props) => props.theme.fontSizes[1]};
  opacity: 0.9;
  margin: 0;
  text-align: center;

  ${mediaQuery.minWidth.md} {
    font-size: ${(props) => props.theme.fontSizes[2]};
  }
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
          <MatrixMenuItem
            variant="footer"
            to="/"
            trackingData={{
              action: tracking.action.open_home,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Home
          </MatrixMenuItem>
          <MatrixMenuItem
            variant="footer"
            to={slugs.blog}
            trackingData={{
              action: tracking.action.open_blog,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Blog
          </MatrixMenuItem>
          <MatrixMenuItem
            variant="footer"
            to={slugs.art}
            trackingData={{
              action: tracking.action.open_art,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Art
          </MatrixMenuItem>
          <MatrixMenuItem
            variant="footer"
            to={slugs.aboutMe}
            trackingData={{
              action: tracking.action.open_about_me,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            About Me
          </MatrixMenuItem>
          <MatrixMenuItem
            variant="footer"
            to={slugs.blogArchive}
            trackingData={{
              action: tracking.action.open_blog_archive,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Archive
          </MatrixMenuItem>
          <MatrixMenuItem
            variant="footer"
            to={slugs.tags}
            trackingData={{
              action: tracking.action.open_blog_tags,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Tags
          </MatrixMenuItem>
        </FooterMenu>

        <FadeSeparator />

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
