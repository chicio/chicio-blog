'use client'

import { trackWith } from "@/lib/tracking/tracking";
import { TrackingElementProps } from "@/types/configuration/tracking";
import Link from "next/link";
import { FC, ReactNode } from "react";

type StandardInternalLinkWithTrackingProps = TrackingElementProps & {
  to: string;
  className?: string;
  children?: ReactNode;
};

export const StandardInternalLinkWithTracking: FC<
  StandardInternalLinkWithTrackingProps
> = ({ children, className, to, trackingData }) => (
  <Link
    className={className}
    href={to}
    onClick={() => {
      trackWith(trackingData);
    }}
  >
    {children}
  </Link>
);
