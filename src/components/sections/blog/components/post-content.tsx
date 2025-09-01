"use client";

import "highlight.js/styles/tokyo-night-dark.css";
import { FC } from "react";
import styled from "styled-components";
import { heading2Style } from "@/components/design-system/atoms/typography/heading2";
import { heading3Style } from "@/components/design-system/atoms/typography/heading3";
import { heading4Style } from "@/components/design-system/atoms/typography/heading4";
import { heading5Style } from "@/components/design-system/atoms/typography/heading5";
import { standardLinkStyle } from "@/components/design-system/atoms/links/standard-link-style";
import { borderRadius } from "@/components/design-system/atoms/effects/border";
import { paragraphStyle } from "@/components/design-system/atoms/typography/paragraph";
import { Heading1 } from "../../../design-system/atoms/typography/heading1";
import { glowContainer } from "../../../design-system/atoms/effects/glow";
import { glassmorphism } from "../../../design-system/atoms/effects/glassmorphism";
import { hideScrollbar } from "../../../design-system/utils/components/hide-scrollbar";
import { quoteStyle } from "@/components/design-system/atoms/typography/quote";

const PostContentContainer = styled.div`
  color: ${(props) => props.theme.colors.primaryTextColor};
  line-height: 1.5;

  & ul li {
    font-size: ${(props) => props.theme.fontSizes[2]};
    line-height: ${(props) => props.theme.lineHeight};
  }

  & p {
    font-size: ${(props) => props.theme.fontSizes[2]};
    margin-left: 0;
    margin-right: 0;
    line-height: ${(props) => props.theme.lineHeight};
  }

  & figure figcaption {
    font-size: ${(props) => props.theme.fontSizes[1]};
    text-align: center;
    line-height: ${(props) => props.theme.lineHeight};
    font-style: italic;
  }

  & h2 {
    ${heading2Style};
    margin-left: 0;
    margin-right: 0;
    line-height: ${(props) => props.theme.lineHeight};
  }

  & h3 {
    ${heading3Style};
    margin-left: 0;
    margin-right: 0;
    line-height: ${(props) => props.theme.lineHeight};
  }

  & h4 {
    ${heading4Style};
    margin-left: 0;
    margin-right: 0;
    line-height: ${(props) => props.theme.lineHeight};
  }

  & h5 {
    ${heading5Style};
    margin-left: 0;
    margin-right: 0;
    line-height: ${(props) => props.theme.lineHeight};
  }

  & a {
    ${standardLinkStyle};
  }

  & blockquote {
    line-height: ${(props) => props.theme.lineHeight};
    ${quoteStyle};
    border-left: 5px solid ${(props) => props.theme.colors.secondaryTextColor};
    margin-left: 0;
    margin-right: 0;
    padding: ${(props) => props.theme.spacing[4]}
      ${(props) => props.theme.spacing[2]};
  }

  & blockquote p {
    line-height: ${(props) => props.theme.lineHeight};
    margin-bottom: 0;
    margin-top: 0;
  }

  & hr {
    height: 1px;
    background: linear-gradient(
      90deg,
      ${(props) => props.theme.colors.generalBackgroundLight},
      ${(props) => props.theme.colors.accentColor},
      ${(props) => props.theme.colors.generalBackgroundLight}
    );
    width: 100%;
    margin: ${(props) => props.theme.spacing[4]} 0;
    height: 1px;
    border: none;
  }

  & .embedVideo-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 100%;
    width: 100%;
    overflow: hidden;
    margin: ${(props) => props.theme.spacing[2]} 0;
  }

  & .embedVideo-container iframe,
  .embedVideo-container object,
  .embedVideo-container embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  & .katex-display > .katex {
    display: inline-block;
    white-space: nowrap;
    max-width: 100%;
    overflow-x: scroll;
    text-align: initial;
    line-height: ${(props) => props.theme.lineHeight};
    ${hideScrollbar};
  }

  & .katex * {
    font-size: ${(props) => props.theme.fontSizes[4]};
  }

  & .emoji-icon {
    top: 4px;
  }

  & pre {
    font-size: ${(props) => props.theme.fontSizes[1]};
    overflow: hidden;
    ${glassmorphism};
    ${hideScrollbar};
  }

  & p code {
    font-size: ${(props) => props.theme.fontSizes[1]};
    color: #d2a8ff;
    background: #0d1117;
    padding: 4px;
    ${borderRadius};
  }

  & li code {
    font-size: ${(props) => props.theme.fontSizes[1]};
    color: #d2a8ff;
    background: #0d1117;
    padding: 4px;
    ${borderRadius};
  }

  & li strong {
    font-weight: 700;
  }

  & img {
    width: 100%;
    ${glowContainer}
  }

  & iframe {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }

  & p strong {
    ${paragraphStyle};
    font-weight: 700;
  }

  & iframe {
    ${glowContainer};
  }
`;

interface PostContentProps {
  html: string;
}

export const PostContent: FC<PostContentProps> = ({ html }) => (
  <PostContentContainer id="blog-post-container" dangerouslySetInnerHTML={{ __html: html }} />
);

export const PostTitle = styled(Heading1)`
  margin: 0;
  word-wrap: break-word;
`;
