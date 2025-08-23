"use client";

import { FC, PropsWithChildren } from "react";
import { BluePill, RedPill } from "../../atoms/effects/pills";
import { StandardInternalLinkWithTracking } from "../../atoms/links/standard-internal-link-with-tracking";
import { TrackingData } from "@/types/tracking";

type PillProps = PropsWithChildren<{
  to: string;
  trackingData: TrackingData;
}>;

export const RedPillLink: FC<PillProps> = ({ children, to, trackingData }) => (
  <StandardInternalLinkWithTracking to={to} trackingData={trackingData}>
    <RedPill>{children}</RedPill>
  </StandardInternalLinkWithTracking>
);

export const BluePillLink: FC<PillProps> = ({ children, to, trackingData }) => (
  <StandardInternalLinkWithTracking to={to} trackingData={trackingData}>
    <BluePill>{children}</BluePill>
  </StandardInternalLinkWithTracking>
);
