'use client'

import { trackWith } from "@/lib/tracking/tracking";
import { TrackingElementProps } from "@/types/configuration/tracking";
import Link from "next/link";
import { FC, ReactNode } from "react";

type CallToActionInternalWithTrackingProps = TrackingElementProps & {
  to: string;
  className?: string;
  children?: ReactNode;
  prefetch?: boolean;
};

export const CallToActionInternalWithTracking: FC<CallToActionInternalWithTrackingProps> =
  ({ children, className, to, trackingData, prefetch = false }) => (
    <Link
      className={`call-to-action${className ? ` ${className}` : ""}`}
      href={to}
      prefetch={prefetch}
      onClick={() => {
        trackWith(trackingData);
      }}
    >
      {children}
    </Link>
  );
