"use client";

import { trackWith } from "@/lib/tracking/tracking";
import { TrackingElementProps } from "@/types/configuration/tracking";
import { FC, ReactNode } from "react";

type StandardExternalLinkWithTrackingProps = TrackingElementProps & {
  href: string;
  target?: string;
  rel?: string;
  children?: ReactNode;
  className?: string;
};

export const StandardExternalLinkWithTracking: FC<
  StandardExternalLinkWithTrackingProps
> = ({ children, href, trackingData, target, rel, className }) => (
  <a
    href={href}
    onClick={() => {
      trackWith(trackingData);
    }}
    className={className}
    target={target}
    rel={rel}
  >
    {children}
  </a>
);
