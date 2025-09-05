'use client'

import { slugs } from "@/types/slug";
import { tracking } from "@/types/tracking";
import { motion } from "framer-motion";
import { FC } from "react";
import styled from "styled-components";
import { MenuItemWithTracking } from "../molecules/menu/menu-item-with-tracking";
import { mediaQuery } from "../utils/media-query";
import { SocialContacts } from "./social-contacts";

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
          <MenuItemWithTracking
            to="/"
            trackingData={{
              action: tracking.action.open_home,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Home
          </MenuItemWithTracking>
          <MenuItemWithTracking
            to={slugs.blog}
            trackingData={{
              action: tracking.action.open_blog,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Blog
          </MenuItemWithTracking>
          <MenuItemWithTracking
            to={slugs.art}
            trackingData={{
              action: tracking.action.open_art,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Art
          </MenuItemWithTracking>
          <MenuItemWithTracking
            to={slugs.aboutMe}
            trackingData={{
              action: tracking.action.open_about_me,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            About Me
          </MenuItemWithTracking>
          <MenuItemWithTracking
            to={slugs.blogArchive}
            trackingData={{
              action: tracking.action.open_blog_archive,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Archive
          </MenuItemWithTracking>
          <MenuItemWithTracking
            to={slugs.tags}
            trackingData={{
              action: tracking.action.open_blog_tags,
              category: trackingCategory,
              label: tracking.label.footer,
            }}
            selected={false}
          >
            Tags
          </MenuItemWithTracking>
        </FooterMenu>

        <hr/>

        <FooterAuthorSection>
          <SocialContacts
            trackingCategory={trackingCategory}
            trackingLabel={tracking.label.footer}
          />
          <p className='m-0 text-center text-sm md:text-base'>
            {`Made with 💝 by ${author} 'Chicio'`}
          </p>
        </FooterAuthorSection>
      </FooterContentContainer>
    </FooterContent>
  </FooterContainer>
);
