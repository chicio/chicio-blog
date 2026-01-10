"use client";

import { TrackingData } from "@/types/configuration/tracking";
import { FC, PropsWithChildren } from "react";
import { BluePill, RedPill } from "../../atoms/effects/pills";
import { StandardInternalLinkWithTracking } from "../../atoms/links/standard-internal-link-with-tracking";

type PillProps = PropsWithChildren<{
  to: string;
  trackingData: TrackingData;
}>;

export const RedPillLink: FC<PillProps> = ({ children, to, trackingData }) => (
  <StandardInternalLinkWithTracking className="no-underline" to={to} trackingData={trackingData}>
    <RedPill>{children}</RedPill>
  </StandardInternalLinkWithTracking>
);

export const BluePillLink: FC<PillProps> = ({ children, to, trackingData }) => (
  <StandardInternalLinkWithTracking className="no-underline" to={to} trackingData={trackingData}>
    <BluePill>{children}</BluePill>
  </StandardInternalLinkWithTracking>
);
