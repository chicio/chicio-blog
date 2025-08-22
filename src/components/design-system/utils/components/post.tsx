"use client";

import "highlight.js/styles/tokyo-night-dark.css";
import { FC } from "react";
import styled from "styled-components";
import { heading2Style } from "@/components/design-system/atoms/heading2";
import { heading3Style } from "@/components/design-system/atoms/heading3";
import { heading4Style } from "@/components/design-system/atoms/heading4";
import { heading5Style } from "@/components/design-system/atoms/heading5";
import { standardLinkStyle } from "@/components/design-system/atoms/standard-link-style";
import { borderRadius } from "@/components/design-system/atoms/border";
import { paragraphStyle } from "@/components/design-system/atoms/paragraph";
import { Heading1 } from "../../atoms/heading1";
import { glowContainer } from "../../atoms/glow";
import { glassmorphism } from "../../atoms/glassmorphism";
import { hideScrollbar } from "./hide-scrollbar";

const PostContentContainer = styled.div`
  color: ${(props) => props.theme.light.primaryTextColor};
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
    line-height: ${(props) => props.theme.lineHeight};
  }

  & blockquote {
    line-height: ${(props) => props.theme.lineHeight};
    color: ${(props) => props.theme.light.secondaryTextColor};
    border-left: 5px solid ${(props) => props.theme.light.secondaryTextColor};
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
      ${(props) => props.theme.dark.generalBackgroundLight},
      ${(props) => props.theme.dark.accentColor},
      ${(props) => props.theme.dark.generalBackgroundLight}
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
    font-family: "Open Sans Bold", Arial, sans-serif;
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
    font-family: "Open Sans Bold", Arial, sans-serif;
    font-weight: 600;
  }

  & iframe {
    ${glowContainer};
  }
`;

interface PostContentProps {
  html: string;
}

export const PostContent: FC<PostContentProps> = ({ html }) => (
  <PostContentContainer dangerouslySetInnerHTML={{ __html: html }} />
);

export const PostTitle = styled(Heading1)`
  margin: 0;
  word-wrap: break-word;
`;
