'use client'

import { trackWith } from "@/lib/tracking/tracking";
import { TrackingElementProps } from "@/types/tracking";
import Link from "next/link";
import { FC, ReactNode } from "react";

type CallToActionInternalWithTrackingProps = TrackingElementProps & {
  to: string;
  className?: string;
  children?: ReactNode;
};

export const CallToActionInternalWithTracking: FC<CallToActionInternalWithTrackingProps> =
  ({ children, className, to, trackingData }) => (
    <Link
      className={`call-to-action${className ? ` ${className}` : ""}`}
      href={to}
      onClick={() => {
        trackWith(trackingData);
      }}
    >
      {children}
    </Link>
  );
