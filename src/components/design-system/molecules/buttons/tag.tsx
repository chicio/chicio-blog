'use client'

import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { tracking } from "@/types/tracking";
import { FC } from "react";
import styled, { css, TransientProps } from "styled-components";
import { glowContainer, glowText } from "../../atoms/effects/glow";

interface TagContentProps {
  big: boolean;
}

const TagLink = styled(StandardInternalLinkWithTracking)<
  TransientProps<TagContentProps>
>`
  display: inline-block;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
`;

const TagText = styled.span<TransientProps<TagContentProps>>`
  color: ${(props) => props.theme.colors.primaryTextColor};
  margin-right: ${(props) => props.theme.spacing[0]};
  margin-bottom: ${(props) => props.theme.spacing[0]};
  font-size: ${(props) =>
    props.$big ? props.theme.fontSizes[5] : props.theme.fontSizes[1]};
  padding: ${props => props.theme.spacing[1]};
  display: block;
  line-height: 1;
  ${glowContainer};
  ${glowText};

  ${(props) =>
    props.$big &&
    css`
      margin-right: ${(props) => props.theme.spacing[4]};
      margin-bottom: ${(props) => props.theme.spacing[6]};
    `};
`;

export type TagProps = TagContentProps & {
  link: string;
  tag: string;
  trackingCategory: string;
  trackingLabel: string;
};

export const Tag: FC<TagProps> = ({
  tag,
  link,
  big,
  trackingCategory,
  trackingLabel,
}) => (
  <TagLink
    trackingData={{
      action: tracking.action.open_blog_tag,
      category: trackingCategory,
      label: trackingLabel,
    }}
    to={link}
    $big={big}
  >
    <TagText $big={big}>{tag}</TagText>
  </TagLink>
);
