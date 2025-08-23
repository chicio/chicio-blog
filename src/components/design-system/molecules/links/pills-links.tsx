"use client";

import { FC, PropsWithChildren } from "react";
import { BluePill, RedPill } from "../../atoms/effects/pills";
import { StandardInternalLinkWithTracking } from "../../atoms/links/standard-internal-link-with-tracking";
import { TrackingData } from "@/types/tracking";
import styled from "styled-components";
import { mediaQuery } from "../../utils/media-query";

type PillProps = PropsWithChildren<{
  to: string;
  trackingData: TrackingData;
}>;

const StyledLink = styled(StandardInternalLinkWithTracking)`
  ${mediaQuery.inputDevice.mouse} {
    &:hover {
      text-decoration: none !important;
    }
  }
`;

export const RedPillLink: FC<PillProps> = ({ children, to, trackingData }) => (
  <StyledLink to={to} trackingData={trackingData}>
    <RedPill>{children}</RedPill>
  </StyledLink>
);

export const BluePillLink: FC<PillProps> = ({ children, to, trackingData }) => (
  <StyledLink to={to} trackingData={trackingData}>
    <BluePill>{children}</BluePill>
  </StyledLink>
);
