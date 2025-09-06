"use client";

import { borderRadius } from "@/components/design-system/atoms/effects/border";
import { quoteStyle } from "@/components/design-system/atoms/typography/quote";
import { FC } from "react";
import styled from "styled-components";
import { glassmorphism } from "../../../design-system/atoms/effects/glassmorphism";
import { glowContainer } from "../../../design-system/atoms/effects/glow";
import { hideScrollbar } from "../../../design-system/utils/components/hide-scrollbar";

const PostContentContainer = styled.div`
  color: ${(props) => props.theme.colors.primaryTextColor};
  line-height: 1.5;

  & ul li {
    font-size: ${(props) => props.theme.fontSizes[2]};
    line-height: ${(props) => props.theme.lineHeight};
  }

  & figure figcaption {
    font-size: ${(props) => props.theme.fontSizes[1]};
    text-align: center;
    line-height: ${(props) => props.theme.lineHeight};
    font-style: italic;
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

  & img {
    width: 100%;
    ${glowContainer}
  }

  & iframe {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
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
