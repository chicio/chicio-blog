"use client";

import { FC, PropsWithChildren } from "react";
import { BluePill, RedPill } from "../../atoms/effects/pills";
import { StandardInternalLinkWithTracking } from "../../atoms/links/standard-internal-link-with-tracking";
import { TrackingData } from "@/types/tracking";
<<<<<<< HEAD
import styled from "styled-components";
import { mediaQuery } from "../../utils/media-query";
=======
>>>>>>> a281755939ffee136f2196d23a659f329aefa535

type PillProps = PropsWithChildren<{
  to: string;
  trackingData: TrackingData;
}>;

<<<<<<< HEAD
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
=======
export const RedPillLink: FC<PillProps> = ({ children, to, trackingData }) => (
  <StandardInternalLinkWithTracking to={to} trackingData={trackingData}>
    <RedPill>{children}</RedPill>
  </StandardInternalLinkWithTracking>
);

export const BluePillLink: FC<PillProps> = ({ children, to, trackingData }) => (
  <StandardInternalLinkWithTracking to={to} trackingData={trackingData}>
    <BluePill>{children}</BluePill>
  </StandardInternalLinkWithTracking>
>>>>>>> a281755939ffee136f2196d23a659f329aefa535
);
